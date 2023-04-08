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

import { InstructionList, TransactionIntent } from "models/transaction";
import { stringToUint8Array, uint8ArrayToString } from "../../utils";

export class DecompileTransactionIntentRequest {
  private _instructionsOutputKind: InstructionList.Kind;
  private _compiledIntent: string;

  public get instructionsOutputKind(): InstructionList.Kind {
    return this._instructionsOutputKind;
  }
  public set instructionsOutputKind(value: InstructionList.Kind) {
    this._instructionsOutputKind = value;
  }

  public get compiledIntent(): Uint8Array {
    return stringToUint8Array(this._compiledIntent);
  }
  public set compiledIntent(value: Uint8Array) {
    this._compiledIntent = uint8ArrayToString(value);
  }

  constructor(
    instructionsOutputKind: InstructionList.Kind,
    compiledIntent: Uint8Array
  ) {
    this._instructionsOutputKind = instructionsOutputKind;
    this._compiledIntent = uint8ArrayToString(compiledIntent);
  }
}

export type DecompileTransactionIntentResponse = TransactionIntent;
