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

import { describe, expect, it } from "vitest";
import {
  KnownEntityAddressesInput,
  LTSRadixEngineToolkit,
  RadixEngineToolkit,
  RawRadixEngineToolkit,
} from "../../src";

describe("Known Entity Addresses", () => {
  it("Known Entity Addresses", async () => {
    const output = await RawRadixEngineToolkit.knownEntityAddresses(
      new KnownEntityAddressesInput(0x01)
    );

    expect(output.xrdResourceAddress).toBeDefined();
  });

  it("Known entity addresses through default wrapper succeeds", async () => {
    const xrdResourceAddress = await RadixEngineToolkit.knownEntityAddresses(
      0x01
    ).then((output) => output.xrdResourceAddress);
    expect(xrdResourceAddress).toBeDefined();
  });

  it("Known entity addresses through LTS wrapper succeeds", async () => {
    const xrdResourceAddress =
      await LTSRadixEngineToolkit.Derive.knownAddresses(0x01).then(
        (output) => output.resources.xrdResource
      );
    expect(xrdResourceAddress).toBeDefined();
  });
});
