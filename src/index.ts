export const hello = async (name: string | number): Promise<string> =>
  Promise.resolve(`Hello ${name}`)

export default hello
