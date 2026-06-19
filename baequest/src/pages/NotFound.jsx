import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
        <main className="flex-1 pt-12 sm:pt-16 pb-10 px-4 sm:px-6">
            <section className="mb-10 sm:mb-12">
                <div className="bg-surface-container-low rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
                    <div className="text-center">
                        <h1 className="text-7xl font-bold mb-4">
                        404
                        </h1>

                        <p className="text-xl mb-6">
                        Page not found
                        </p>

                        <Link
                        to="/"
                        className="hidden md:inline-flex bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:bg-primary-dim active:scale-95 transition-all duration-300"
                        >
                        Go Home
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    </div>
  );
}