import { test } from 'node:test';
import assert from 'node:assert/strict';
import { can } from '../lib/permissions.ts';
test('guest cannot access private resources',()=>{assert.equal(can(undefined,'dashboard:read'),false);assert.equal(can(undefined,'product:delete'),false)});
test('user can read dashboard but cannot delete',()=>{assert.equal(can('user','dashboard:read'),true);assert.equal(can('user','product:delete'),false)});
test('admin can read and delete',()=>{assert.equal(can('admin','dashboard:read'),true);assert.equal(can('admin','product:delete'),true)});
