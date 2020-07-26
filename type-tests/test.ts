/* eslint-disable */

import { PojoMap } from '.';


function shouldNotAllowAccessOfInvalidKey() {
  const map = PojoMap.empty<'a' | 'b' |'c', number>();

  // $ExpectError
  PojoMap.get(map, 'd');
  // $ExpectError
  PojoMap.has(map, 'd');
}

function shouldNotAllowSettingUndefined() {
    const map = PojoMap.empty<string, string>();
    
    PojoMap.values(map); // $ExpectType string[]
    // $ExpectError
    PojoMap.set(map, 'myvalue', undefined);
}
