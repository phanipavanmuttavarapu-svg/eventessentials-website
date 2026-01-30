export default function Decor() {
  return (
    <main className="min-h-screen px-6 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Event Decor</h1>

      <p className="text-gray-600 max-w-2xl mx-auto mb-8">
        Design and visualize stage decor for any event.
        Upload decor images, customize layouts and preview your stage.
      </p>

      <a
        href="/decor/designer"
        className="inline-block px-6 py-3 bg-black text-white rounded-full"
      >
        Start Stage Designing
      </a>
    </main>
  );
}
