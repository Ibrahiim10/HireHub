import { motion } from 'framer-motion';
import { FaBolt, FaShieldAlt, FaClock } from 'react-icons/fa';

const features = [
  {
    icon: <FaBolt className="text-white text-2xl" />,
    title: 'Lightning Fast',
    description:
      'Convert your data in seconds with our optimized processing engine.',
    color: 'from-purple-500 to-blue-500',
  },
  {
    icon: <FaShieldAlt className="text-white text-2xl" />,
    title: 'Secure & Private',
    description:
      'Your data is processed securely and never stored on our servers.',
    color: 'from-pink-500 to-purple-500',
  },
  {
    icon: <FaClock className="text-white text-2xl" />,
    title: '24/7 Available',
    description: 'Access our platform anytime, anywhere, from any device.',
    color: 'from-indigo-500 to-purple-500',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const FeatureSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#0f172a] to-[#2d3b52] text-white py-28 px-3 sm:px-6 lg:px-12 overflow-hidden">
      {/* Glowing background circles */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute -top-10 -left-10 w-72 h-72 bg-purple-700 rounded-full filter blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-16 -right-10 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl"
      />

      {/* Section heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-16"
      >
        Why Choose Our Platform?
      </motion.h2>

      {/* Feature cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <div
              className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeatureSection;
