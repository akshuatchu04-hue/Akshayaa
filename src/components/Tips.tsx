import { Lightbulb, Apple, Droplets, Thermometer, ShieldCheck } from "lucide-react";

export function Tips() {
  const tips = [
    {
      icon: <Apple className="text-red-500" />,
      title: "Selection Guide",
      content: "Look for vibrant colors and firm texture. Avoid fruits with soft spots, bruises, or broken skin."
    },
    {
      icon: <Droplets className="text-blue-500" />,
      title: "Proper Washing",
      content: "Always wash fruits under cold running water before consumption to remove surface bacteria and pesticides."
    },
    {
      icon: <Thermometer className="text-orange-500" />,
      title: "Storage Temperature",
      content: "Most fruits stay fresh longer in the refrigerator, but some like bananas and avocados should be kept at room temperature."
    },
    {
      icon: <ShieldCheck className="text-[#25f447]" />,
      title: "Nutritional Value",
      content: "Fresh fruits are highest in vitamins and antioxidants. The more vibrant the color, the higher the nutrient density."
    }
  ];

  return (
    <div className="flex flex-col px-4 pt-6">
      <h2 className="text-2xl font-bold mb-2">Freshness Tips</h2>
      <p className="text-slate-500 text-sm mb-8">How to keep your fruits vital and healthy</p>

      <div className="space-y-6 pb-6">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-4">
            <div className="size-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
              {tip.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">{tip.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{tip.content}</p>
            </div>
          </div>
        ))}

        <div className="mt-8 p-6 rounded-2xl bg-[#25f447]/10 border border-[#25f447]/20">
          <div className="flex items-center gap-2 mb-3 text-[#25f447]">
            <Lightbulb size={20} />
            <h4 className="font-bold">Pro Tip</h4>
          </div>
          <p className="text-sm text-slate-700 italic">
            "Ethylene-producing fruits like apples and bananas can speed up the ripening of other fruits nearby. Store them separately if you want to extend the shelf life of other produce!"
          </p>
        </div>
      </div>
    </div>
  );
}
