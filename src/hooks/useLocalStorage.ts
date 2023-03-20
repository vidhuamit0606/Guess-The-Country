const useLocalStorage = (method: "get" | "set", name: string, item: number = 0) => {
  if (method === "get") {
    const highscore = localStorage.getItem(name);

    if (!highscore) {
      return;
    }

    return Number(highscore);
  }

  localStorage.setItem(name, item.toString());
};

export default useLocalStorage;
