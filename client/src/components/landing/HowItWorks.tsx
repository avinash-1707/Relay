import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Sign Up & Set Your Profile",
    desc: "Create an account with email/password or OAuth. Set your display name, status, and upload a profile picture.",
    color: "#00E5CC",
  },
  {
    num: "02",
    title: "Discover & Connect",
    desc: "Search the global user list to find anyone registered on Relay. Start a new conversation in one click.",
    color: "#0088FF",
  },
  {
    num: "03",
    title: "Message in Real Time",
    desc: "Send and receive messages instantly via Socket.io. Watch typing indicators, presence dots, and read receipts update live.",
    color: "#A855F7",
  },
  {
    num: "04",
    title: "Scroll Through History",
    desc: "All messages persist in MongoDB. Open any chat to load full history chronologically with infinite scroll pagination.",
    color: "#F59E0B",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0088FF]/6 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5CC] to-[#0088FF]">
              Relay
            </span>{" "}
            works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/45 max-w-md mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            From sign-up to live chat in four steps.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative text-center lg:text-left"
              >
                {/* Number bubble */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mb-6 mx-auto lg:mx-0 border"
                  style={{
                    borderColor: `${step.color}40`,
                    backgroundColor: `${step.color}10`,
                    color: step.color,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-base font-bold mb-3 text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm text-white/40 leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
