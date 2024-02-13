export function get(c) {
  const [getter,] = c;

  return getter;
}

export function set(c, value) {
  const [, setter] = c;

  setter(value);
}