export const hello = async (name: string | number): Promise<string> =>
  await Promise.resolve(`Hello ${name}`)

export default hello
