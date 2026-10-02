import ErrorPage from "../../components/ErrorPage/ErrorPage";

export default function BadRequest() {
  return (
    <ErrorPage
      code={400}
      title="Bad Request"
      message="The server could not understand the request because it was invalid."
      buttonText="Go to Dashboard"
      buttonPath="/dashboard"
    />
  );
}
