import { trpc } from "../utils/trpc";

const Test = () => {
  const hello = trpc.todos.useQuery();
  console.log(hello);
  return <div>Test</div>;
};

export default Test;
