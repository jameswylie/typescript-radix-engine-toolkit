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

import { describe, expect, test } from "vitest";
import {
  Convert,
  DecodeAddressRequest,
  EncodeAddressRequest,
  EntityAddress,
  RawRadixEngineToolkit,
} from "../../src";

describe.each([
  {
    expectedAddressBytes: Convert.Uint8Array.from(
      "000000000000000000000000000000000000000000000000000002"
    ),
    expectedAddress: new EntityAddress.PackageAddress(
      "package_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqmre2w5"
    ),
  },
])(
  "Address encoding and decoding for $intent",
  ({ expectedAddressBytes, expectedAddress }) => {
    test(`${expectedAddressBytes} encodes to ${expectedAddress}`, async () => {
      // Act
      let encodedAddress = await RawRadixEngineToolkit.encodeAddress(
        new EncodeAddressRequest(expectedAddressBytes, 0xf2)
      );

      // Assert
      expect(encodedAddress).toEqual(expectedAddress);
    });

    test(`${expectedAddress} decodes to ${expectedAddressBytes}`, async () => {
      // Act
      let address = await RawRadixEngineToolkit.decodeAddress(
        new DecodeAddressRequest(expectedAddress.address)
      );

      // Assert
      expect(address.data).toEqual(expectedAddressBytes);
    });
  }
);
