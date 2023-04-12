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

import { Expose, Type, instanceToPlain } from "class-transformer";
import { ManifestSborValue, ScryptoSborValue } from ".";
import { valueTypeOptions as manifestSborValueTypeOptions } from "./manifest_sbor";
import { valueTypeOptions as scryptoSborValueTypeOptions } from "./scrypto_sbor";

export class Value {
  readonly type: "ScryptoSbor" | "ManifestSbor";

  constructor(type: "ScryptoSbor" | "ManifestSbor") {
    this.type = type;
  }
}

export class ScryptoSbor extends Value implements ISborValueConvertible {
  @Expose()
  @Type(() => ScryptoSborValue.Value, scryptoSborValueTypeOptions)
  value: ScryptoSborValue.Value;

  constructor(value: ScryptoSborValue.Value) {
    super("ScryptoSbor");
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  toSborValue(): ScryptoSbor | ManifestSbor {
    return this;
  }
}

export class ManifestSbor extends Value implements ISborValueConvertible {
  @Expose()
  @Type(() => ManifestSborValue.Value, manifestSborValueTypeOptions)
  value: ManifestSborValue.Value;

  constructor(value: ManifestSborValue.Value) {
    super("ManifestSbor");
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  toSborValue(): ScryptoSbor | ManifestSbor {
    return this;
  }
}

export interface ISborValueConvertible {
  toSborValue: () => ScryptoSbor | ManifestSbor;
}
