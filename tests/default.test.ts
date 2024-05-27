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

import * as fs from "fs";
import { describe, expect, it, test } from "vitest";
import {
  Convert,
  PrivateKey,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionHeader,
  defaultValidationConfig,
} from "../src";
import {
  AddressDecodeInput,
  AddressDecodeOutput,
  AddressEntityTypeInput,
  AddressEntityTypeOutput,
  DeriveNodeAddressFromPublicKeyInput,
  DeriveNodeAddressFromPublicKeyOutput,
  DeriveOlympiaAccountAddressFromPublicKeyInput,
  DeriveOlympiaAccountAddressFromPublicKeyOutput,
  DerivePublicKeyFromOlympiaAccountAddressInput,
  DerivePublicKeyFromOlympiaAccountAddressOutput,
  DeriveVirtualAccountAddressFromOlympiaAccountAddressInput,
  DeriveVirtualAccountAddressFromOlympiaAccountAddressOutput,
  DeriveVirtualAccountAddressFromPublicKeyInput,
  DeriveVirtualAccountAddressFromPublicKeyOutput,
  DeriveVirtualIdentityAddressFromPublicKeyInput,
  DeriveVirtualIdentityAddressFromPublicKeyOutput,
  GeneratedConverter,
  InstructionsCompileInput,
  InstructionsCompileOutput,
  InstructionsConvertInput,
  InstructionsConvertOutput,
  InstructionsDecompileInput,
  InstructionsDecompileOutput,
  InstructionsExtractAddressesInput,
  InstructionsExtractAddressesOutput,
  InstructionsStaticallyValidateInput,
  InstructionsStaticallyValidateOutput,
  IntentCompileInput,
  IntentCompileOutput,
  IntentDecompileInput,
  IntentDecompileOutput,
  IntentHashInput,
  IntentHashOutput,
  IntentStaticallyValidateInput,
  IntentStaticallyValidateOutput,
  ManifestCompileInput,
  ManifestCompileOutput,
  ManifestDecompileInput,
  ManifestDecompileOutput,
  ManifestStaticallyValidateInput,
  ManifestStaticallyValidateOutput,
  NotarizedTransactionCompileInput,
  NotarizedTransactionCompileOutput,
  NotarizedTransactionDecompileInput,
  NotarizedTransactionDecompileOutput,
  NotarizedTransactionHashInput,
  NotarizedTransactionHashOutput,
  NotarizedTransactionStaticallyValidateInput,
  NotarizedTransactionStaticallyValidateOutput,
  SignedIntentCompileInput,
  SignedIntentCompileOutput,
  SignedIntentDecompileInput,
  SignedIntentDecompileOutput,
  SignedIntentHashInput,
  SignedIntentHashOutput,
  SignedIntentStaticallyValidateInput,
  SignedIntentStaticallyValidateOutput,
  UtilsKnownAddressesInput,
  UtilsKnownAddressesOutput,
} from "../src/generated";

describe("Default Radix Engine Toolkit Tests", () => {
  it("Build Information can be obtained from the toolkit", async () => {
    // Act
    const buildInformation = await RadixEngineToolkit.Build.information();

    // Assert
    expect(buildInformation.version).toEqual("2.1.0-dev1");
  });

  moduleTestVector<
    DeriveVirtualAccountAddressFromPublicKeyInput,
    DeriveVirtualAccountAddressFromPublicKeyOutput
  >(
    "derive",
    "derive_virtual_account_address_from_public_key",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
          GeneratedConverter.PublicKey.fromGenerated(inputVector.public_key),
          Convert.String.toNumber(inputVector.network_id)
        );

      // Assert
      expect(output).toEqual(outputVector);
    }
  );

  moduleTestVector<
    DeriveVirtualIdentityAddressFromPublicKeyInput,
    DeriveVirtualIdentityAddressFromPublicKeyOutput
  >(
    "derive",
    "derive_virtual_identity_address_from_public_key",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualIdentityAddressFromPublicKey(
          GeneratedConverter.PublicKey.fromGenerated(inputVector.public_key),
          Convert.String.toNumber(inputVector.network_id)
        );
      // Assert
      expect(output).toEqual(outputVector);
    }
  );

  moduleTestVector<
    DeriveVirtualAccountAddressFromOlympiaAccountAddressInput,
    DeriveVirtualAccountAddressFromOlympiaAccountAddressOutput
  >(
    "derive",
    "derive_virtual_account_address_from_olympia_account_address",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.virtualAccountAddressFromOlympiaAccountAddress(
          inputVector.olympia_account_address,
          Convert.String.toNumber(inputVector.network_id)
        );
      // Assert
      expect(output).toEqual(outputVector);
    }
  );

  moduleTestVector<
    DerivePublicKeyFromOlympiaAccountAddressInput,
    DerivePublicKeyFromOlympiaAccountAddressOutput
  >(
    "derive",
    "derive_public_key_from_olympia_account_address",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.publicKeyFromOlympiaAccountAddress(
          inputVector
        );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    }
  );

  moduleTestVector<
    DeriveOlympiaAccountAddressFromPublicKeyInput,
    DeriveOlympiaAccountAddressFromPublicKeyOutput
  >(
    "derive",
    "derive_olympia_account_address_from_public_key",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.Derive.olympiaAccountAddressFromPublicKey(
          Convert.HexString.toUint8Array(inputVector.public_key),
          GeneratedConverter.OlympiaNetwork.fromGenerated(
            inputVector.olympia_network
          )
        );

      // Assert
      expect(output).toEqual(outputVector);
    }
  );

  moduleTestVector<
    DeriveNodeAddressFromPublicKeyInput,
    DeriveNodeAddressFromPublicKeyOutput
  >(
    "derive",
    "derive_node_address_from_public_key",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Derive.nodeAddressFromPublicKey(
        Convert.HexString.toUint8Array(inputVector.public_key),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output).toEqual(outputVector);
    }
  );

  moduleTestVector<InstructionsConvertInput, InstructionsConvertOutput>(
    "instructions",
    "instructions_convert",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.convert(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.Instructions.toGenerated(output)).toEqual(
        outputVector
      );
    }
  );

  moduleTestVector<InstructionsCompileInput, InstructionsCompileOutput>(
    "instructions",
    "instructions_compile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.compile(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    }
  );

  moduleTestVector<InstructionsDecompileInput, InstructionsDecompileOutput>(
    "instructions",
    "instructions_decompile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        Convert.String.toNumber(inputVector.network_id),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.Instructions.toGenerated(output)).toEqual(
        outputVector
      );
    }
  );

  moduleTestVector<
    InstructionsExtractAddressesInput,
    InstructionsExtractAddressesOutput
  >(
    "instructions",
    "instructions_extract_addresses",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.extractAddresses(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(convertRecordValueToSet(output)).toEqual(
        convertRecordValueToSet(outputVector.addresses)
      );
    }
  );

  moduleTestVector<
    InstructionsStaticallyValidateInput,
    InstructionsStaticallyValidateOutput
  >(
    "instructions",
    "instructions_statically_validate",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Instructions.staticallyValidate(
        GeneratedConverter.Instructions.fromGenerated(inputVector.instructions),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    }
  );

  moduleTestVector<ManifestCompileInput, ManifestCompileOutput>(
    "manifest",
    "manifest_compile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.TransactionManifest.compile(
        GeneratedConverter.TransactionManifest.fromGenerated(
          inputVector.manifest
        ),
        Convert.String.toNumber(inputVector.network_id)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    }
  );

  moduleTestVector<ManifestDecompileInput, ManifestDecompileOutput>(
    "manifest",
    "manifest_decompile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.TransactionManifest.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        Convert.String.toNumber(inputVector.network_id),
        inputVector.instructions_kind
      );

      // Assert
      expect(
        GeneratedConverter.TransactionManifest.toGenerated(output)
      ).toEqual(outputVector);
    }
  );

  moduleTestVector<
    ManifestStaticallyValidateInput,
    ManifestStaticallyValidateOutput
  >(
    "manifest",
    "manifest_statically_validate",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.TransactionManifest.staticallyValidate(
          GeneratedConverter.TransactionManifest.fromGenerated(
            inputVector.manifest
          ),
          Convert.String.toNumber(inputVector.network_id)
        );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    }
  );

  moduleTestVector<IntentCompileInput, IntentCompileOutput>(
    "intent",
    "intent_compile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.compile(
        GeneratedConverter.Intent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    }
  );

  moduleTestVector<IntentHashInput, IntentHashOutput>(
    "intent",
    "intent_hash",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.hash(
        GeneratedConverter.Intent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(
        GeneratedConverter.TransactionHash.fromGenerated(outputVector)
      );
    }
  );

  moduleTestVector<IntentDecompileInput, IntentDecompileOutput>(
    "intent",
    "intent_decompile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.Intent.toGenerated(output)).toEqual(
        outputVector
      );
    }
  );

  moduleTestVector<
    IntentStaticallyValidateInput,
    IntentStaticallyValidateOutput
  >(
    "intent",
    "intent_statically_validate",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Intent.staticallyValidate(
        GeneratedConverter.Intent.fromGenerated(inputVector.intent),
        GeneratedConverter.ValidationConfig.fromGenerated(
          inputVector.validation_config
        )
      );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    }
  );

  moduleTestVector<SignedIntentCompileInput, SignedIntentCompileOutput>(
    "signed_intent",
    "signed_intent_compile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.compile(
        GeneratedConverter.SignedIntent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    }
  );

  moduleTestVector<SignedIntentHashInput, SignedIntentHashOutput>(
    "signed_intent",
    "signed_intent_hash",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.hash(
        GeneratedConverter.SignedIntent.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(
        GeneratedConverter.TransactionHash.fromGenerated(outputVector)
      );
    }
  );

  moduleTestVector<SignedIntentDecompileInput, SignedIntentDecompileOutput>(
    "signed_intent",
    "signed_intent_decompile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        inputVector.instructions_kind
      );

      // Assert
      expect(GeneratedConverter.SignedIntent.toGenerated(output)).toEqual(
        outputVector
      );
    }
  );

  moduleTestVector<
    SignedIntentStaticallyValidateInput,
    SignedIntentStaticallyValidateOutput
  >(
    "signed_intent",
    "signed_intent_statically_validate",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.SignedIntent.staticallyValidate(
        GeneratedConverter.SignedIntent.fromGenerated(
          inputVector.signed_intent
        ),
        GeneratedConverter.ValidationConfig.fromGenerated(
          inputVector.validation_config
        )
      );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    }
  );

  moduleTestVector<
    NotarizedTransactionCompileInput,
    NotarizedTransactionCompileOutput
  >(
    "notarized_transaction",
    "notarized_transaction_compile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.NotarizedTransaction.compile(
        GeneratedConverter.NotarizedTransaction.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(Convert.HexString.toUint8Array(outputVector));
    }
  );

  moduleTestVector<
    NotarizedTransactionHashInput,
    NotarizedTransactionHashOutput
  >(
    "notarized_transaction",
    "notarized_transaction_hash",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.NotarizedTransaction.hash(
        GeneratedConverter.NotarizedTransaction.fromGenerated(inputVector)
      );

      // Assert
      expect(output).toEqual(
        GeneratedConverter.TransactionHash.fromGenerated(outputVector)
      );
    }
  );

  moduleTestVector<
    NotarizedTransactionDecompileInput,
    NotarizedTransactionDecompileOutput
  >(
    "notarized_transaction",
    "notarized_transaction_decompile",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.NotarizedTransaction.decompile(
        Convert.HexString.toUint8Array(inputVector.compiled),
        inputVector.instructions_kind
      );

      // Assert
      expect(
        GeneratedConverter.NotarizedTransaction.toGenerated(output)
      ).toEqual(outputVector);
    }
  );

  moduleTestVector<
    NotarizedTransactionStaticallyValidateInput,
    NotarizedTransactionStaticallyValidateOutput
  >(
    "notarized_transaction",
    "notarized_transaction_statically_validate",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
          GeneratedConverter.NotarizedTransaction.fromGenerated(
            inputVector.notarized_transaction
          ),
          GeneratedConverter.ValidationConfig.fromGenerated(
            inputVector.validation_config
          )
        );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    }
  );

  moduleTestVector<
    NotarizedTransactionStaticallyValidateInput,
    NotarizedTransactionStaticallyValidateOutput
  >(
    "notarized_transaction",
    "notarized_transaction_statically_validate",
    async (inputVector, outputVector) => {
      // Act
      const output =
        await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
          GeneratedConverter.NotarizedTransaction.fromGenerated(
            inputVector.notarized_transaction
          ),
          GeneratedConverter.ValidationConfig.fromGenerated(
            inputVector.validation_config
          )
        );

      // Assert
      expect(output.kind).toEqual(outputVector.kind);
    }
  );

  moduleTestVector<UtilsKnownAddressesInput, UtilsKnownAddressesOutput>(
    "utils",
    "utils_known_address",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Utils.knownAddresses(
        Convert.String.toNumber(inputVector)
      );

      let outputRecord: Record<string, Record<string, string>> = {};
      for (const outerKey in output) {
        outputRecord[camelToSnakeCase(outerKey)] = {};
        const value = output[outerKey];

        for (const innerKey in value) {
          outputRecord[camelToSnakeCase(outerKey)][camelToSnakeCase(innerKey)] =
            output[outerKey][innerKey];
        }
      }

      // Assert
      expect(outputRecord).toEqual(outputVector);
    }
  );

  moduleTestVector<AddressEntityTypeInput, AddressEntityTypeOutput>(
    "address",
    "address_entity_type",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Address.entityType(inputVector);

      // Assert
      expect(output).toEqual(
        GeneratedConverter.EntityType.fromGenerated(outputVector)
      );
    }
  );

  moduleTestVector<AddressDecodeInput, AddressDecodeOutput>(
    "address",
    "address_decode",
    async (inputVector, outputVector) => {
      // Act
      const output = await RadixEngineToolkit.Address.decode(inputVector);

      // Assert
      expect(output.networkId).toEqual(
        Convert.String.toNumber(outputVector.network_id)
      );
      expect(output.entityType).toEqual(
        GeneratedConverter.EntityType.fromGenerated(outputVector.entity_type)
      );
      expect(output.hrp).toEqual(outputVector.hrp);
      expect(output.data).toEqual(
        Convert.HexString.toUint8Array(outputVector.data)
      );
    }
  );

  it("Transaction Builder Produces Statically Valid Transactions", async () => {
    // Arrange
    const notaryPrivateKey: PrivateKey = new PrivateKey.Secp256k1(
      "f9d5cd3cbd7bd0defcad16f92f2c03f97d9441335e28411a0bfadb634e192738"
    );
    const header: TransactionHeader = {
      networkId: 0x01,
      startEpochInclusive: 0x00,
      endEpochExclusive: 0x10,
      nonce: 0x00,
      notaryPublicKey: notaryPrivateKey.publicKey(),
      notaryIsSignatory: true,
      tipPercentage: 0x00,
    };
    const validationConfig = defaultValidationConfig(0x01);

    // Act
    let notarizedTransaction = await TransactionBuilder.new().then((builder) =>
      builder
        .header(header)
        .manifest({
          instructions: {
            kind: "String",
            value: "DROP_ALL_PROOFS;",
          },
          blobs: [],
        })
        .notarize(notaryPrivateKey)
    );
    const staticValidationResult =
      await RadixEngineToolkit.NotarizedTransaction.staticallyValidate(
        notarizedTransaction,
        validationConfig
      );

    // Assert
    expect(staticValidationResult.kind).toEqual("Valid");
  });

  it("Programmatic JSON can be encoded through the toolkit", async () => {
    // Arrange
    const programmaticJson = {
      kind: "Reference",
      value:
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd",
    };

    // Act
    const encoded = await RadixEngineToolkit.ScryptoSbor.encodeProgrammaticJson(
      programmaticJson
    );

    // Assert
    expect(encoded[0]).toEqual(92); /* Scrypto SBOR prefix */
  });
});

const moduleTestVector = <I, O>(
  moduleName: string,
  functionName: string,
  callback: (input: I, output: O) => Promise<void>
): any => {
  type TestVector = {
    input: I;
    output: O;
  };

  const fileContent = fs.readFileSync(
    `./resources/fixtures/${moduleName}.json`,
    "utf8"
  );
  const testVectors: TestVector[] = JSON.parse(fileContent)[functionName];
  return describe.concurrent(
    `Module: "${moduleName}", Function: "${functionName}"`,
    () => {
      test.each(testVectors)("Case Number: %#.", async ({ input, output }) => {
        await callback(input, output);
      });
    }
  );
};

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

function convertRecordValueToSet<K extends string | number | symbol, V>(
  map: Record<K, V[]>
): Record<K, Set<V>> {
  // @ts-ignore
  let newMap: Record<K, Set<V>> = {};
  for (const key in map) {
    const value = map[key];
    newMap[key] = new Set(value);
  }
  return newMap;
}
