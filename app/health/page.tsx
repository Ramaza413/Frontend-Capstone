export default async function HealthPage() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1",
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Health Check
      </h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}