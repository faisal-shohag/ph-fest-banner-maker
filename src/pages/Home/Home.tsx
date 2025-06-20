import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CreateNewCanvas from "@/components/common/CreateNewCanvas";
import RecentCanvas from "./RecentCanvas";
import NavBar from "./NavBar";
export default function Home() {
  return (
    <div className={`transition-colors duration-500  `}>
        <NavBar/>
        <section className="flex  pt-5">
          <div className="  g-card rounded-2xl  py-5 w-screen  text-center">
            <div className="font-bold text-3xl">
              Create, Inspire and Explore...
            </div>

            <div>
              <CreateNewCanvas />
            </div>
          </div>
        </section>

        <RecentCanvas/>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join millions of creators who trust PhotoCraft to bring their
                vision to life. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl">
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/10"
                >
                  View Pricing
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
    </div>
  );
}
