import { useQuery } from "@tanstack/react-query";
import "./App.css";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// async function fetchTodo(): Promise<Todo[]> {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Data fetcing error");
//   }
//   const result = await response.json();
//   return result;
// }

function App() {
  const apiUrl = "https://jsonplaceholder.typicode.com/todos";
  const { isPending, isError, data, error } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error("Data fetching error");
        }
        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
      // return new Promise((resolve, reject) => {
      //   let oReq = new XMLHttpRequest();
      //   oReq.addEventListener("load", () => {
      //     resolve(JSON.parse(oReq.responseText));
      //   });
      //   signal?.addEventListener("abort", () => {
      //     oReq.abort();
      //     reject();
      //   });
      //   oReq.open("GET", apiUrl);
      //   oReq.send();
      // });
    },
    retry: 0,
    // retryDelay: 2 * 1000,
    staleTime: 1000 * 60,
  });

  if (isPending) {
    return <span>Loading...</span>;
  } else if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Title</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.userId}</td>
              <td>{todo.title}</td>
              <td>{todo.completed ? "Complete" : "Incomplete"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
