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
  InformationRequest,
  InformationResponse,
  RawRadixEngineToolkit,
} from "../src";

describe("essential", () => {
  it("essential", async () => {
    let information = await RawRadixEngineToolkit.information(
      new InformationRequest()
    );
    let expected = new InformationResponse(
      "0.9.0",
      "9d140797d5641179fa78566b0f3e66fc6fe01e4c"
    );

    expect(information).toEqual(expected);
  });
});
