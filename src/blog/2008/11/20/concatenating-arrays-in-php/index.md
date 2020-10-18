---
title: "Concatenating arrays in PHP"
date: "2008-11-20T12:46:48.000Z"
modified: "2011-01-03T17:20:13.000Z"
folder: "2008/11/20/concatenating-arrays-in-php"
---

Just a quick post so I know where to look the next time I forget how to concatenate arrays in PHP.  
Use [`array_merge`](http://php.net/array_merge) to concatenate two numerically-indexed arrays; not [`array_push`](http://php.net/array_push) and not [the array union operator: `+`](http://php.net/language.operators.array).

    $first = array('doh', 'ray', 'me');
    $second = array('fah', 'soh', 'lah', 'te', 'do');
    echo "Union: ", var_export($first + $second, true), "n";
    echo "Merge: ", var_export(array_merge($first, $second), true), "n";
    // array_push returns int, not an array:
    array_push($first, $second);
    echo "Push: ", var_export($first, true), "n";

The output:

Union: array (
0 => 'doh',
1 => 'ray',
2 => 'me',
3 => 'te',
4 => 'do',
)
Merge: array (
0 => 'doh',
1 => 'ray',
2 => 'me',
3 => 'fah',
4 => 'soh',
5 => 'lah',
6 => 'te',
7 => 'do',
)
Push: array (
0 => 'doh',
1 => 'ray',
2 => 'me',
3 =>
array (
0 => 'fah',
1 => 'soh',
2 => 'lah',
3 => 'te',
4 => 'do',
),
)
