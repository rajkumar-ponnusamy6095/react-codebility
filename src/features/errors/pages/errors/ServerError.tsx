import ErrorPage from "../../../../components/ErrorPage/ErrorPage";

export default function ServerError() {
  return (
    <ErrorPage
      code={500}
      title="Internal Server Error"
      message="Something went wrong on the server. Please try again later."
      buttonText="Dashboard"
      buttonPath="/dashboard"
      retryButtonText="Try Again"
    />
  );
}
