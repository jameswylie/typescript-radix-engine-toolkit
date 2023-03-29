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

import wasmInit from "../../resources/radix-engine-toolkit.wasm?init";

/**
 * Wraps a Radix Engine Toolkit WASM instance providing a high level API for making calls to the
 * Radix Engine Toolkit.
 */
class RadixEngineToolkitWasmWrapper {
  /**
   * An object containing objects and functions exported by the Radix Engine Toolkit WASM module.
   * @private
   */
  private exports: RadixEngineToolkitExports;

  /**
   * An instance created from the Radix Engine Toolkit module.
   * @private
   */
  private instance: WebAssembly.Instance;

  constructor(instance: WebAssembly.Instance) {
    this.instance = instance;
    this.exports = instance.exports as unknown as RadixEngineToolkitExports;
  }

  public static async new(): Promise<RadixEngineToolkitWasmWrapper> {
    let instance = await wasmInit({});
    return new RadixEngineToolkitWasmWrapper(instance);
  }

  /**
   * A high-level method for calling functions from the `RadixEngineToolkitFFI` through a simple
   * interface.
   *
   * The main purpose of this method is to provide a higher-level interface for calling into the
   * `RadixEngineToolkit`,
   * as such, this method performs all required memory allocation, deallocation, object
   * serialization, deserialization
   * encoding, and decoding required for any call into the RadixEngineToolkit
   * @param request An object containing the request payload
   * @param fn The function to call of the `RadixEngineToolkitFFI`
   * @return A generic object of type `O` of the response to the request
   * @private
   */
  public callFunction<I, O>(request: I, fn: (pointer: number) => number): O {
    // Write the request object to memory and get a pointer to where it was written
    let requestPointer: number = this.writeObjectToMemory(
      request as unknown as object
    );

    // Call the WASM function with the request pointer
    let responsePointer: number = fn(requestPointer);

    // Read and deserialize the response
    let response: O = this.readObjectFromMemory(responsePointer);

    // Deallocate the request and response pointers
    this.deallocateMemory(requestPointer);
    this.deallocateMemory(responsePointer);

    // Return the object back to the caller
    return response;
  }

  /**
   * Allocates memory of a certain capacity on the WebAssembly instance's linear memory through the
   * `RadixEngineToolkit`'s internal memory allocator
   * @param capacity The capacity of the memory to allocate
   * @return A memory pointer of the allocated memory
   * @private
   */
  private allocateMemory(capacity: number): number {
    return this.exports.toolkit_alloc(capacity);
  }

  /**
   * Deallocates memory beginning from the provided memory pointer and ending at the first
   * null-terminator found
   * @param pointer A memory pointer to the starting location of the memory to deallocate
   * @private
   */
  private deallocateMemory(pointer: number) {
    this.exports.toolkit_free_c_string(pointer);
  }

  /**
   * Serializes an object to a JSON string
   * @param object The object to serialize
   * @return A string of the serialized representation
   * @private
   */
  private serializeObject(object: Object): string {
    return JSON.stringify(object);
  }

  /**
   * Deserializes a JSON string to an object of the generic type `T`.
   * @param string The JSON string to deserialize.
   * @return A generic object of type T deserialized from the JSON string.
   * @private
   */
  private deserializeString<T>(string: string): T {
    return JSON.parse(string) as T;
  }

  /**
   * A method to write strings to memory in the way expected by the Radix Engine Toolkit.
   *
   * This method first UTF-8 encodes the passed string and adds a null-terminator to it. It then
   * allocates enough memory for the encoded string and writes it to memory. Finally, this method
   * returns the pointer back to the caller to use.
   *
   * Note: Since the pointer is returned to the caller, it is now the caller's burden to deallocate
   * this memory when it is no longer needed.
   *
   * @param str A string to write to memory
   * @return A pointer to the memory location containing the null-terminated UTF-8 encoded string
   * @private
   */
  private writeStringToMemory(str: string): number {
    // UTF-8 encode the string and add the null terminator to it.
    let nullTerminatedUtf8EncodedString: Uint8Array = new Uint8Array([
      ...new TextEncoder().encode(str),
      0,
    ]);

    // Allocate memory for the string
    let memoryPointer: number = this.allocateMemory(
      nullTerminatedUtf8EncodedString.length
    );

    // Write the string to the instance's linear memory
    const view: Uint8Array = new Uint8Array(
      this.exports.memory.buffer,
      memoryPointer
    );
    view.set(nullTerminatedUtf8EncodedString);

    // return the memory pointer back to the caller
    return memoryPointer;
  }

  /**
   * This method reads a UTF-8 null-terminated string the instance's linear memory and returns it
   * as a JS string.
   * @param pointer A pointer to the memory location containing the string
   * @return A JS string of the read and decoded string
   * @private
   */
  private readStringFromMemory(pointer: number): string {
    // Determine the length of the string based on the first null terminator
    const view: Uint8Array = new Uint8Array(
      this.exports.memory.buffer,
      pointer
    );
    const length: number = view.findIndex((byte) => byte === 0);

    // Read the UTF-8 encoded string from memory
    let nullTerminatedUtf8EncodedString: Uint8Array = new Uint8Array(
      this.exports.memory.buffer,
      pointer,
      length
    );

    // Decode the string and return it back to the caller
    return new TextDecoder().decode(nullTerminatedUtf8EncodedString);
  }

  /**
   * Writes an object to memory by serializing it to JSON and UTF-8 encoding the serialized string.
   * @param obj The object to write to the instance's linear memory.
   * @return A pointer to the location of the object in memory
   * @private
   */
  private writeObjectToMemory(obj: object): number {
    // Serialize the object to json
    let serializedObject: string = this.serializeObject(obj);

    // Write the string to memory and return the pointer
    return this.writeStringToMemory(serializedObject);
  }

  /**
   * Reads a UTF-8 encoded JSON string from memory and deserializes it as `T`.
   * @param pointer A memory pointer to the location of the linear memory where the object lives.
   * @return An object of type `T` of the deserialized object
   * @private
   */
  private readObjectFromMemory<T>(pointer: number): T {
    // Read the UTF-8 encoded null-terminated string from memory
    let serializedObject: string = this.readStringFromMemory(pointer);

    // Deserialize and return to the caller
    return this.deserializeString(serializedObject);
  }
}

/**
 * Defines the exports of the Radix Engine Toolkit WASM module
 */
interface RadixEngineToolkitExports {
  /**
   * The Radix Engine Toolkit WASM exports its own memory and does not require any memory imports.
   * This is the memory exported by the WebAssembly instance.
   */
  memory: WebAssembly.Memory;

  information(pointer: number): number;
  convert_manifest(pointer: number): number;
  analyze_manifest(pointer: number): number;
  compile_transaction_intent(pointer: number): number;
  compile_signed_transaction_intent(pointer: number): number;
  compile_notarized_transaction(pointer: number): number;
  decompile_transaction_intent(pointer: number): number;
  decompile_signed_transaction_intent(pointer: number): number;
  decompile_notarized_transaction(pointer: number): number;
  decompile_unknown_transaction_intent(pointer: number): number;
  derive_babylon_address_from_olympia_address(pointer: number): number;
  derive_virtual_account_address(pointer: number): number;
  derive_virtual_identity_address(pointer: number): number;
  derive_non_fungible_global_id_from_public_key(pointer: number): number;
  encode_address(pointer: number): number;
  decode_address(pointer: number): number;
  sbor_encode(pointer: number): number;
  sbor_decode(pointer: number): number;
  known_entity_addresses(pointer: number): number;
  statically_validate_transaction(pointer: number): number;
  hash(pointer: number): number;

  /**
   * A foreign function interface for the toolkit function responsible for all allocation of memory
   * used in thetoolkit
   * @param capacity The capacity of the memory to allocate.
   * @return A memory pointer pointing to the start of the allocated memory
   */
  toolkit_alloc(capacity: number): number;

  /**
   * A foreign function interface for the toolkit function responsible for the deallocation of
   * memory.
   *
   * It should be noted that this function operates with two main assumptions:
   * 1. That the memory that will be freed has been allocated with the same allocator.
   * 2. That the memory contains a null-terminated c-string.
   *
   * Therefore, this function does not require any additional information as to the size of the
   * memory to deallocate, this will be determined based on the first null-terminator encountered.
   *
   * @param pointer A pointer to the start of the memory to free.
   */
  toolkit_free_c_string(pointer: number): void;
}

export { RadixEngineToolkitWasmWrapper, RadixEngineToolkitExports };
