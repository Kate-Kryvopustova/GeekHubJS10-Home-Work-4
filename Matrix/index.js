function matrix(R, C, r0, c0) {
  let count = 1;
  let result = [];

  function add(R, C, r0, c0) {
    if (r0 >= 0 && r0 < R && c0 >= 0 && c0 < C) {
      result.push([r0, c0]);
    }
  }

  while (result.length < R * C) {
    for (let i = 0; i < count; i++) {
      add(R, C, r0, c0++)
    }
    for (let i = 0; i < count; i++) {
      add(R, C, r0++, c0)
    }
    count++
    for (let i = 0; i < count; i++) {
      add(R, C, r0, c0--)
    }
    for (let i = 0; i < count; i++) {
      add(R, C, r0--, c0)
    }
    count++
  }

  return result;
}

matrix(1, 4, 0, 0);
matrix(5, 6, 1, 4);