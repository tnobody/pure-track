export const fail = (reason: string = ""): never => {
    throw Error(reason)
}