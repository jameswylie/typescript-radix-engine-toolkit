// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import {
  CompileSignedTransactionIntentOutput,
  CompileTransactionIntentOutput,
  HashSignedTransactionIntentOutput,
  HashTransactionIntentOutput,
  NotarizedTransaction,
  SignatureWithPublicKey,
  SignedTransactionIntent,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../models";
import { RET } from "../wrapper/raw";
import { RadixEngineToolkitWasmWrapper } from "../wrapper/wasm_wrapper";
import {
  NotarySignatureSource,
  SignatureSource,
  resolveNotarySignature,
  resolveSignature,
} from "./builder_models";

export class TransactionBuilder {
  private retWrapper: RadixEngineToolkitWasmWrapper;

  constructor(retWrapper: RadixEngineToolkitWasmWrapper) {
    this.retWrapper = retWrapper;
  }

  public static async new(): Promise<TransactionBuilder> {
    const ret = await RET;
    return new TransactionBuilder(ret);
  }

  public static async from(
    transactionIntent: TransactionIntent | SignedTransactionIntent
  ): Promise<TransactionBuilderIntentSignaturesStep> {
    const builder = await TransactionBuilder.new();
    if (transactionIntent instanceof TransactionIntent) {
      return builder
        .header(transactionIntent.header)
        .manifest(transactionIntent.manifest);
    } else if (transactionIntent instanceof SignedTransactionIntent) {
      return new TransactionBuilderIntentSignaturesStep(
        builder.retWrapper,
        transactionIntent.intent.header,
        transactionIntent.intent.manifest,
        transactionIntent.intentSignatures
      );
    } else {
      throw new TypeError("Invalid type passed in for transaction intent");
    }
  }

  public header(header: TransactionHeader): TransactionBuilderManifestStep {
    return new TransactionBuilderManifestStep(this.retWrapper, header);
  }
}

export class TransactionBuilderManifestStep {
  private retWrapper: RadixEngineToolkitWasmWrapper;
  private header: TransactionHeader;

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    header: TransactionHeader
  ) {
    this.retWrapper = retWrapper;
    this.header = header;
  }

  public manifest(
    manifest: TransactionManifest
  ): TransactionBuilderIntentSignaturesStep {
    return new TransactionBuilderIntentSignaturesStep(
      this.retWrapper,
      this.header,
      manifest
    );
  }
}

export class TransactionBuilderIntentSignaturesStep {
  private retWrapper: RadixEngineToolkitWasmWrapper;
  private intent: TransactionIntent;
  private intentSignatures: Array<SignatureWithPublicKey.SignatureWithPublicKey>;

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    header: TransactionHeader,
    manifest: TransactionManifest,
    intentSignatures: Array<SignatureWithPublicKey.SignatureWithPublicKey> = []
  ) {
    this.retWrapper = retWrapper;
    this.intent = new TransactionIntent(header, manifest);
    this.intentSignatures = intentSignatures;
  }

  public sign(source: SignatureSource): TransactionBuilderIntentSignaturesStep {
    const { intentHash } = this.compileIntent();

    this.intentSignatures.push(resolveSignature(source, intentHash));

    return this;
  }

  public notarize(source: NotarySignatureSource): NotarizedTransaction {
    const { signedIntent, signedIntentHash } = this.compileSignedIntent();

    return new NotarizedTransaction(
      signedIntent,
      resolveNotarySignature(source, signedIntentHash)
    );
  }

  public compileIntent(): {
    compiledIntent: Uint8Array;
    intent: TransactionIntent;
    intentHash: Uint8Array;
  } {
    const input = this.intent;
    const output = this.retWrapper.invoke(
      input,
      this.retWrapper.exports.hash_transaction_intent,
      HashTransactionIntentOutput
    );
    const intentHash = output.hash;

    const compiledIntent = this.compileIntentInternal(this.intent);

    return {
      compiledIntent,
      intent: this.intent,
      intentHash,
    };
  }

  public compileSignedIntent(): {
    compiledSignedIntent: Uint8Array;
    signedIntent: SignedTransactionIntent;
    signedIntentHash: Uint8Array;
  } {
    const signedIntent = new SignedTransactionIntent(
      this.intent,
      this.intentSignatures
    );

    const input = signedIntent;
    const output = this.retWrapper.invoke(
      input,
      this.retWrapper.exports.hash_signed_transaction_intent,
      HashSignedTransactionIntentOutput
    );
    const signedIntentHash = output.hash;

    const compiledSignedIntent = this.compileSignedIntentInternal(signedIntent);

    return {
      compiledSignedIntent,
      signedIntent,
      signedIntentHash,
    };
  }

  private compileIntentInternal(intent: TransactionIntent): Uint8Array {
    const input = intent;
    const output = this.retWrapper.invoke(
      input,
      this.retWrapper.exports.compile_transaction_intent,
      CompileTransactionIntentOutput
    );
    return output.compiledIntent;
  }

  private compileSignedIntentInternal(
    intent: SignedTransactionIntent
  ): Uint8Array {
    const input = intent;
    const output = this.retWrapper.invoke(
      input,
      this.retWrapper.exports.compile_signed_transaction_intent,
      CompileSignedTransactionIntentOutput
    );
    return output.compiledIntent;
  }
}
