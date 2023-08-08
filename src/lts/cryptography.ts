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

import * as Default from "..";
import {
  ED25519_PRIVATE_KEY_LENGTH,
  ED25519_PUBLIC_KEY_LENGTH,
  ED25519_SIGNATURE_LENGTH,
  SECP256K1_PRIVATE_KEY_LENGTH,
  SECP256K1_PUBLIC_KEY_LENGTH,
  SECP256K1_SIGNATURE_LENGTH,
} from "./constants";
import { Bytes, resolveBytesAndCheckLength } from "./utils";

import * as RetPrivateKey from "../models/cryptographic/private_key";

export enum Curve {
  Secp256k1 = "Secp256k1",
  Ed25519 = "Ed25519",
}

export abstract class PublicKey {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends PublicKey {
    public readonly curve: Curve = Curve.Secp256k1;
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        bytes,
        SECP256K1_PUBLIC_KEY_LENGTH
      );
    }
  };

  static Ed25519 = class extends PublicKey {
    public readonly curve: Curve = Curve.Ed25519;
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(bytes, ED25519_PUBLIC_KEY_LENGTH);
    }
  };

  rawBytes = (): Uint8Array => this.bytes;
  hexString = (): string => Default.Convert.Uint8Array.toHexString(this.bytes);
  toString = this.hexString;

  get publicKey(): Uint8Array {
    return this.rawBytes();
  }
}

export abstract class Signature {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends Signature {
    public readonly curve: Curve = Curve.Secp256k1;
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        bytes,
        SECP256K1_SIGNATURE_LENGTH
      );
    }
  };

  static Ed25519 = class extends Signature {
    public readonly curve: Curve = Curve.Ed25519;
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(bytes, ED25519_SIGNATURE_LENGTH);
    }
  };

  rawBytes = (): Uint8Array => this.bytes;
  hexString = (): string => Default.Convert.Uint8Array.toHexString(this.bytes);
  toString = this.hexString;

  get signature(): Uint8Array {
    return this.rawBytes();
  }
}

export abstract class SignatureWithPublicKey {
  abstract readonly curve: Curve;
  abstract readonly signature: Uint8Array;
  abstract readonly publicKey: Uint8Array | undefined;

  static Secp256k1 = class extends SignatureWithPublicKey {
    public readonly curve: Curve = Curve.Secp256k1;
    public readonly signature: Uint8Array;
    public readonly publicKey: undefined;

    constructor(signature: Bytes) {
      super();
      this.signature = resolveBytesAndCheckLength(
        signature,
        SECP256K1_SIGNATURE_LENGTH
      );
    }
  };

  static Ed25519 = class extends SignatureWithPublicKey {
    public readonly curve: Curve = Curve.Ed25519;
    public readonly signature: Uint8Array;
    public readonly publicKey: Uint8Array;

    constructor(signature: Bytes, publicKey: Bytes) {
      super();
      this.signature = resolveBytesAndCheckLength(
        signature,
        ED25519_SIGNATURE_LENGTH
      );
      this.publicKey = resolveBytesAndCheckLength(
        publicKey,
        ED25519_SIGNATURE_LENGTH
      );
    }
  };
}

export abstract class PrivateKey implements Signer {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends PrivateKey implements Signer {
    public readonly curve: Curve = Curve.Secp256k1;
    public readonly bytes: Uint8Array;

    constructor(privateKey: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        privateKey,
        SECP256K1_PRIVATE_KEY_LENGTH
      );
    }

    publicKey(): PublicKey {
      return new PublicKey.Secp256k1(this.publicKeyBytes());
    }
    publicKeyBytes(): Uint8Array {
      return RetPrivateKey.publicKey({
        privateKey: this.bytes,
        kind: this.curve,
      }).publicKey;
    }
    publicKeyHex(): string {
      return Default.Convert.Uint8Array.toHexString(this.publicKeyBytes());
    }
    sign(messageHash: Uint8Array): Uint8Array {
      return RetPrivateKey.sign(
        { privateKey: this.bytes, kind: this.curve },
        messageHash
      );
    }
    signToSignature(messageHash: Uint8Array): Signature {
      return new Signature.Secp256k1(this.sign(messageHash));
    }
    signToSignatureWithPublicKey(
      messageHash: Uint8Array
    ): SignatureWithPublicKey {
      return new SignatureWithPublicKey.Secp256k1(this.sign(messageHash));
    }
    produceSignature(messageHash: Uint8Array): SignerResponse {
      return super.produceSignature(messageHash);
    }
  };

  static Ed25519 = class extends PrivateKey implements Signer {
    public readonly curve: Curve = Curve.Ed25519;
    public readonly bytes: Uint8Array;

    constructor(privateKey: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        privateKey,
        ED25519_PRIVATE_KEY_LENGTH
      );
    }

    publicKey(): PublicKey {
      return new PublicKey.Ed25519(this.publicKeyBytes());
    }
    publicKeyBytes(): Uint8Array {
      return RetPrivateKey.publicKey({
        privateKey: this.bytes,
        kind: this.curve,
      }).publicKey;
    }
    publicKeyHex(): string {
      return Default.Convert.Uint8Array.toHexString(this.publicKeyBytes());
    }
    sign(messageHash: Uint8Array): Uint8Array {
      return RetPrivateKey.sign(
        { privateKey: this.bytes, kind: this.curve },
        messageHash
      );
    }
    signToSignature(messageHash: Uint8Array): Signature {
      return new Signature.Ed25519(this.sign(messageHash));
    }
    signToSignatureWithPublicKey(
      messageHash: Uint8Array
    ): SignatureWithPublicKey {
      return new SignatureWithPublicKey.Ed25519(
        this.sign(messageHash),
        this.publicKeyBytes()
      );
    }
    produceSignature(messageHash: Uint8Array): SignerResponse {
      return super.produceSignature(messageHash);
    }
  };

  abstract publicKey(): PublicKey;
  abstract publicKeyBytes(): Uint8Array;
  abstract publicKeyHex(): string;
  abstract sign(messageHash: Uint8Array): Uint8Array;
  abstract signToSignature(messageHash: Uint8Array): Signature;
  abstract signToSignatureWithPublicKey(
    messageHash: Uint8Array
  ): SignatureWithPublicKey;
  produceSignature(messageHash: Uint8Array): SignerResponse {
    let signature = this.sign(messageHash);
    let publicKey = this.publicKeyBytes();
    return {
      curve: this.curve,
      signature,
      publicKey,
    };
  }
}

export interface Signer {
  produceSignature: (messageHash: Uint8Array) => SignerResponse;
}

export interface AsyncSigner {
  produceSignature: (messageHash: Uint8Array) => Promise<SignerResponse>;
}

export type SignerResponse = {
  curve: Curve;
  signature: Uint8Array;
  publicKey: Uint8Array;
};

export type SignatureSource<T> = Signer | T | Default.SignatureFunction<T>;

export const resolveSignatureSource = <T>(
  source: SignatureSource<T>,
  messageHash: Uint8Array,
  signerResponseCallback: (signerResponse: SignerResponse) => T
): T => {
  if (typeof source === "function") {
    return (source as Default.SignatureFunction<T>)(messageHash);
  } else if ("produceSignature" in (source as Signer)) {
    return signerResponseCallback(
      (source as Signer).produceSignature(messageHash)
    );
  } else {
    return source as T;
  }
};
