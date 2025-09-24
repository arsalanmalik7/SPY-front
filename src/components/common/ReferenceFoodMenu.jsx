import React, { useState } from "react";
import { X, Search } from "lucide-react";

const ReferenceFoodMenuPanel = ({ isOpen, onClose, menuData }) => {
  const [search, setSearch] = useState("");

  // Transform menu data into sections
  const menuSections = React.useMemo(() => {
    if (!Array.isArray(menuData) || menuData.length === 0) {
      return {};
    }

    return menuData.reduce((acc, dish) => {
      if (!dish?.type?.[0]) {
        return acc;
      }

      const type = dish?.type[0];
      if (!acc[type]) {
        acc[type] = [];
      }

      // Prepare all fields with defaults if missing
      const allergens = Array.isArray(dish.allergens)
        ? dish.allergens.join(", ")
        : dish.allergens || "None";
      // Health restrictions: flatten if object, else use as string/array
      let healthRestrictions = "None";
      if (dish.dietary_restrictions) {
        if (
          typeof dish.dietary_restrictions === "object" &&
          dish.dietary_restrictions.health
        ) {
          healthRestrictions = Array.isArray(dish.dietary_restrictions.health)
            ? dish.dietary_restrictions.health.join(", ")
            : dish.dietary_restrictions.health;
        } else if (Array.isArray(dish.dietary_restrictions)) {
          healthRestrictions = dish.dietary_restrictions.join(", ");
        } else if (typeof dish.dietary_restrictions === "string") {
          healthRestrictions = dish.dietary_restrictions;
        }
      }
      // Belief accommodations
      let beliefAccommodations = "None";
      if (
        dish.dietary_restrictions &&
        typeof dish.dietary_restrictions === "object" &&
        dish.dietary_restrictions.belief
      ) {
        beliefAccommodations = Array.isArray(dish.dietary_restrictions.belief)
          ? dish.dietary_restrictions.belief.join(", ")
          : dish.dietary_restrictions.belief;
      }
      // Lifestyle accommodations
      let lifestyleAccommodations = "None";
      if (
        dish.dietary_restrictions &&
        typeof dish.dietary_restrictions === "object" &&
        dish.dietary_restrictions.lifestyle
      ) {
        lifestyleAccommodations = Array.isArray(
          dish.dietary_restrictions.lifestyle
        )
          ? dish.dietary_restrictions.lifestyle.join(", ")
          : dish.dietary_restrictions.lifestyle;
      }
      // Substitution accommodations
      let substitutionAccommodations = "None";
      if (dish.substitution_accommodations) {
        substitutionAccommodations = Array.isArray(
          dish.substitution_accommodations
        )
          ? dish.substitution_accommodations.join(", ")
          : dish.substitution_accommodations;
      }
      // Substitution notes
      let substitutionNotes = dish.substitution_notes || "None";
        let temperature = dish?.temperature || "None";
      acc[type].push({
        name: dish?.name,
        price: `$${dish?.price?.toFixed(2)}`,
        description: dish?.description,
        allergens,
        healthRestrictions,
        beliefAccommodations,
        lifestyleAccommodations,
        substitutionAccommodations,
        substitutionNotes,
        temperature,
        image_url: dish?.image_url || null,
      });
      return acc;
    }, {});
  }, [menuData]);

  // Convert sections object to array format
  const formattedMenu = React.useMemo(
    () =>
      Object.entries(menuSections || {}).map(([section, items]) => ({
        section,
        items,
      })),
    [menuSections]
  );

  React.useEffect(() => {
    console.log("menuData received in ReferenceFoodMenuPanel:", menuData);
  }, [menuData]);
  // Filter menu by search
  const filteredMenu = React.useMemo(
    () =>
      formattedMenu
        .map((section) => ({
          ...section,
          items: section?.items?.filter((item) => {
            const searchLower = search?.toLowerCase();
            return (
              item?.name?.toLowerCase()?.includes(searchLower) ||
              item?.description?.toLowerCase()?.includes(searchLower) ||
              item?.badges?.some((b) =>
                b?.label?.toLowerCase()?.includes(searchLower)
              )
            );
          }),
        }))
        .filter((section) => section.items.length > 0),
    [formattedMenu, search]
  );

  if (!isOpen) return null;
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:max-w-sm md:max-w-sm lg:max-w-sm bg-white shadow-lg z-[200] transition-transform duration-300 ease-in-out flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-200">
        <h2 className="text-base text-left font-semibold text-black">
          Reference Menu
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 p-1 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
      {/* Search Bar */}
      <div className="px-3 sm:px-4 pb-2 pt-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C1121F]"
          />
          <input
            type="text"
            placeholder="Search dishes or ingredients..."
            className="w-full pl-9 pr-3 py-2 rounded-md bg-background text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FFD6A0]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pt-2 pb-4 space-y-6">
        {filteredMenu.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            {search
              ? `No results found for "${search}"`
              : "No menu items available"}
          </div>
        )}
        {filteredMenu.map((section) => (
          <div key={section.section}>
            <h3 className="text-sm text-left font-semibold text-black mb-3">
              {section.section}
            </h3>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="w-full bg-background rounded-lg px-3 sm:px-4 py-3 flex flex-col"
                >
                  {item.image_url && (
                    <img
                      src={
                        item.image_url.startsWith("/")
                          ? process.env.REACT_APP_IMAGE_BASE_URL +
                            `${item.image_url}`
                          : item.image_url
                      }
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black text-base sm:text-base md:text-lg text-left">
                      {item.name}
                    </span>
                    <span className="text-black text-sm font-semibold text-right">
                      {item?.price}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm mb-1 text-left">
                    {item.description}
                  </div>
                  <div className="text-sm text-left">
                    <span className="font-bold">Allergens Included: </span>
                    {item.allergens}
                  </div>
                  <div className="text-sm text-left">
                    <span className="font-bold">
                      Health Restrictions Included:{" "}
                    </span>
                    {item.healthRestrictions}
                  </div>
                  <div className="text-sm text-left">
                    <span className="font-bold">Belief Accommodations: </span>
                    {item.beliefAccommodations}
                  </div>
                  <div className="text-sm text-left">
                    <span className="font-bold">
                      Lifestyle Accommodations:{" "}
                    </span>
                    {item.lifestyleAccommodations}
                  </div>
                  <div className="text-sm text-left">
                    <span className="font-bold">
                      Substitution Accommodations:{" "}
                    </span>
                    {item.substitutionAccommodations}
                  </div>
                  <div className="text-sm text-left">
                    <span className="font-bold">Substitution Notes: </span>
                    {item.substitutionNotes}
                  </div>
                  <div className="text-sm text-left">
                    <span className="font-bold">Temperature: </span>
                    {item.temperature}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferenceFoodMenuPanel;
