import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();

  return (
    <main className={"w-full h-full flex flex-col items-center justify-center"}>
      <div id={"error-page"}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occured</p>
        <p>
          {/*@ts-ignore*/}
          {error.statusText || error.message}
        </p>
      </div>
    </main>
  );
}
