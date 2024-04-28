import BackButton from "@/components/navigation/BackButton";
import GenUIChat from "@/components/ai/gen-ui/GenUIChat";

const GenUIPage = () => {
  return (
    <main className="flex flex-col justify-center p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Generative UI</h1>
      </div>
      <section className="py-4">
        <p className="mb-4">
          Find related code in{" "}
          <span className="rounded border border-gray-400 p-1 font-mono text-gray-400">
            /lib/gen-ui/actions.tsx
          </span>
        </p>
        <GenUIChat />
      </section>
      <div>
        <BackButton to="/ai" label="AI Dashboard" />
      </div>
    </main>
  );
};

export default GenUIPage;
