import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
// Use the cloneable native Blob: jsdom's Blob does not survive structuredClone
// in fake-indexeddb, while browsers clone their native Blob correctly.
import {Blob as NativeBlob} from 'node:buffer';
Object.defineProperty(globalThis,'Blob',{value:NativeBlob,configurable:true});
