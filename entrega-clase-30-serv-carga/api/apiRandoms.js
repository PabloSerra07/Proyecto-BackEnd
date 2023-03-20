function RandomNFunc(cant) {
  const nums = {};
  for (let i = 0; i < cant; i++) {
    const random = Math.floor(Math.random() * 1000) + 1;
    nums[random] = nums[random] ? nums[random] + 1 : 1;
  }
  return nums
}

process.on('message', (cant) => {
  const randomNum = RandomNFunc(cant);
  process.send(randomNum);
})
