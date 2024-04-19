export const hello = async (name: number | string): Promise<string> =>
  await Promise.resolve(`Hello ${name}`)

export default hello
