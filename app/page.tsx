import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import HeroSection from "@/components/Hero";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import Image from "next/image";
import Link from "next/dist/client/link";

export default function Home() {
  return (
    <div className="mt-40">
      <HeroSection />
      <section className="py-20 bg-black">
        <div className=" container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData, index) => (
              <div key={index} className="text-center ">
                <div className="text-4xl font-bold text-fuchsia-400 mb-2 ">
                  {statsData.value}
                </div>
                <div className="text-white">{statsData.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, index) => (
              <Card key={index} className="bg-slate-950/80 text-white">
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue flex  items-center justify-center mx-auto  mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 ">User's View</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((testimonials, index) => (
              <Card key={index} className="bg-slate-950/80 text-white">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonials.image}
                      alt={testimonials.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-4"
                    />
                    <div className="ml-4">
                      <div className="font-semibold">{testimonials.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonials.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonials.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center ">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Join thousands of satisfied users with our finance management
            platform
          </h2>
          <Link href="/dashboard">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded animate-bounce mt-6">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
