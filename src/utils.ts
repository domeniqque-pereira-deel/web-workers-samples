const bigTask = (qtd: number) => {
  const sum = new Array(qtd)
    .fill(0)
    .map((el, index) => el + index)
    .reduce((acc, el) => acc + el, 0);

  console.log(sum);
}

export function runBigTask(qtd: number) {
  bigTask(qtd);

  return '🎉 done';
}

export async function runAsyncBigTask(qtd: number) {
  bigTask(qtd);

  return '🎉 done';
}