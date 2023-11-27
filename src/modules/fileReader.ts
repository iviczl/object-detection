export default {
  readJsonFile: async (path: string) => {
    const response = await fetch(path)
    if (response.ok) {
      return await response.json()
    }
    return null
  },
}
