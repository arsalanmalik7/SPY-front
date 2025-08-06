import { useState, useEffect } from "react";
import Button from "./button";
import { X } from "lucide-react";
import { MenuService } from "../../services/MenuService";
import { RestaurantsService } from "../../services/Restaurants";

export default function WineItemEditPanel({ item, onClose, onSave, isSaving, validWineTypes }) {
  const [formData, setFormData] = useState({
    producer_name: "",
    product_name: "",
    varietals: [],
    region: {
      country: "",
      region: "",
      sub_region: "",
      commune_appellation: "",
      vineyard: "",
    },
    vintage: "",
    category: "",
    is_filtered: false,
    has_residual_sugar: false,
    style: {
      name: "",
      body: "",
      texture: "",
      flavor_intensity: null,
      type: "",
      body_rank: null,
    },
    notes: "",
    status: true,
    is_organic: false,
    is_biodynamic: false,
    is_vegan: false,
    sub_category: "",
    restaurant_uuid: "",
    offering: {
      by_the_glass: false,
      by_the_bottle: false,
      glass_price: null,
      bottle_price: null,
    },
  });

  const wineStyles = [
    {
      name: "Fruit Driven Sparkling",
      category: "Sparkling",
      body: "Light - Medium",
      texture: "Light - Medium, Fresh",
      flavorIntensity: "Light - Medium, Crisp & Fruity",
      bgColor: "#fdfcc9",
    },
    {
      name: "Complex Sparkling",
      category: "Sparkling",
      body: "Light - Medium",
      texture: "Light - Medium, Rich",
      flavorIntensity: "Light - Medium, Minerality",
      bgColor: "#fbd779",
    },
    {
      name: "Fresh, Unoaked White",
      category: "White",
      body: "Light - Medium",
      texture: "Crisp, Refreshing",
      flavorIntensity: "Light - Medium, Mild",
      bgColor: "#f8f8bb",
    },
    {
      name: "Earthy White",
      category: "White",
      body: "Medium - Full",
      texture: "Firm, Substantial",
      flavorIntensity: "Medium, Minerality",
      bgColor: "#e7e983",
    },
    {
      name: "Aromatic White",
      category: "White",
      body: "Light - Medium, some Full",
      texture: "Crisp, some Soft",
      flavorIntensity: "High, Complex",
      bgColor: "#f5dc55",
    },
    {
      name: "Rich, Oaky White",
      category: "White",
      body: "Full",
      texture: "Soft, Rich",
      flavorIntensity: "High, Oaky",
      bgColor: "#f6c02e",
    },
    {
      name: "Mild, Mannered Red",
      category: "Red",
      body: "Light - Medium",
      texture: "Low Tannin, Gentle",
      flavorIntensity: "Light - Medium, Subtle, Refreshing",
      bgColor: "#f84d78",
    },
    {
      name: "Soft, Fruity Red",
      category: "Red",
      body: "Light - Medium",
      texture: "Low-Medium Tannin, Soft",
      flavorIntensity: "Medium - High, Refreshing",
      bgColor: "#d1436a",
    },
    {
      name: "Fresh, Spicy Red",
      category: "Red",
      body: "Medium, some Full",
      texture: "Medium Tannin, Firm",
      flavorIntensity: "Medium - High, Vibrant",
      bgColor: "#8d1036",
    },
    {
      name: "Powerful Red",
      category: "Red",
      body: "Full",
      texture: "High Tannin, Sturdy",
      flavorIntensity: "Medium - High, Concentrated",
      bgColor: "#4b0d1a",
    },
    {
      name: "Aromatic Orange",
      category: "Orange",
      body: "Light - Medium",
      texture: "Low Tannin, Crisp",
      flavorIntensity: "Medium - High, Refreshing",
      bgColor: "#f2bf57",
    },
    {
      name: "Fruity Orange",
      category: "Orange",
      body: "Medium - Full",
      texture: "Medium Tannin, Balanced",
      flavorIntensity: "Medium - High, Refined",
      bgColor: "#e3a74f",
    },
    {
      name: "Rich Orange",
      category: "Orange",
      body: "Full",
      texture: "High Tannin, Robust",
      flavorIntensity: "Medium - High, Extracted",
      bgColor: "#b55205",
    },
    {
      name: "Blush Rose",
      category: "Rose",
      body: "Light - Medium",
      texture: "Light - Medium, Viscous",
      flavorIntensity: "Medium - High, Slightly Sweet to Sweet",
      bgColor: "#f9b9b4",
    },
    {
      name: "Dry Rose",
      category: "Rose",
      body: "Light",
      texture: "Light, Crisp",
      flavorIntensity: "Light - Medium, Dry to Slightly Sweet",
      bgColor: "#f8639d",
    },
    {
      name: "Sparkling Dessert",
      category: "Dessert",
      body: "Light - Medium",
      texture: "Light - Medium, Fresh",
      flavorIntensity: "Light - Medium, Luscious Fruit",
      bgColor: "#fee08c",
    },
    {
      name: "Subtle, Aromatic Dessert",
      category: "Dessert",
      body: "Medium - Full",
      texture: "Medium - High, Creamy",
      flavorIntensity: "Medium - High, Concentrated",
      bgColor: "#f2b126",
    },
    {
      name: "Rich, Fruity Dessert",
      category: "Dessert",
      body: "Full",
      texture: "High Tannin, Substantial",
      flavorIntensity: "Medium - High, Extracted",
      bgColor: "#991b00",
    },
  ];

  const categories = validWineTypes;

  const CATEGORY_BASE_COLORS = {
    Red: "#e53935",
    White: "#fbc02d",
    Orange: "#fb8c00",
    Rose: "#f06292",
    Sparkling: "#ffd54f",
    Dessert: "#a1887f",
  };

  const [newVarietal, setNewVarietal] = useState("");
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    if (item) {
      const defaultOffering = {
        by_the_glass: false,
        by_the_bottle: false,
        glass_price: null,
        bottle_price: null,
      };
      setFormData({
        ...item,
        varietals: Array.isArray(item.varietals)
          ? item.varietals
          : [item.varietals],
        sub_category: item?.sub_category,
        offering: { ...defaultOffering, ...(item.offering || {}) },
      });
      setSelectedStyle(item?.sub_category);
      // Check if the image URL is from the API
      const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL || "";
      setImagePreview(item.image_url ? `${baseUrl}${item.image_url}` : "");
    }
  }, [item]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (formData.category) {
      const stylesByCategory = wineStyles.filter(
        (style) => style.category === formData.category
      );
      setFilteredStyles(stylesByCategory);
    } else {
      setFilteredStyles([]);
    }
  }, [formData.category]);

  useEffect(() => {
    // Fetch restaurants for dropdown
    const fetchRestaurants = async () => {
      try {
        const data = await RestaurantsService.getAllRestaurants();
        setRestaurants(data);
        // If editing, set selected restaurant if available in item
        if (item && item.restaurant) {
          setSelectedRestaurant(data.find((r) => r._id === item.restaurant));
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchRestaurants();
  }, [item]);

  const validateForm = () => {
    const errors = {
      region: {},
    };

    if (!formData.producer_name.trim()) {
      errors.producer_name = "Producer name is required";
    }

    if (!formData.product_name.trim()) {
      errors.product_name = "Product name is required";
    }

    if (!formData.varietals.length) {
      errors.varietals = "At least one varietal is required";
    }

    if (!formData.region.country) {
      errors.region.country = "Country is required";
    }
    if (!formData.region.region) {
      errors.region.region = "Region is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (
      !formData.style.body &&
      !formData.style.name &&
      !formData.style.texture &&
      !formData.style.flavor_intensity
    ) {
      errors.style = "Style is Required";
    }

    // Vintage validation
    if (formData.vintage) {
      const year = Number(formData.vintage);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1800 || year > currentYear) {
        errors.vintage = `Vintage must be between 1800 and ${currentYear}`;
      }
    }

    setValidationErrors(errors);
    const topLevelErrors = Object.keys(errors).filter(key => {
      if (key === "region") {
        return Object.keys(errors.region).length > 0;
      }
      return true; // e.g., producer_name, category, etc.
    });

    return topLevelErrors.length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("region.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        region: {
          ...formData.region,
          [field]: value,
        },
      });
    } else if (name.startsWith("style.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        style: {
          ...formData.style,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Local image preview
      setError(null);
    }
  };

  const handleAddVarietal = () => {
    if (!newVarietal.trim()) return;

    // Split by comma and process each varietals
    const varietalsToAdd = newVarietal
      .split(',')
      .map(varietal => varietal.trim())
      .filter(varietal => varietal !== '' && !formData.varietals.includes(varietal));

    if (varietalsToAdd.length > 0) {
      setFormData({
        ...formData,
        varietals: [...formData.varietals, ...varietalsToAdd],
      });
      setNewVarietal("");

      // Clear validation error when varietals is added
      if (validationErrors.varietals) {
        setValidationErrors(prev => ({
          ...prev,
          varietals: undefined
        }));
      }
    }
  };

  const handleRemoveVarietal = (varietal) => {
    setFormData({
      ...formData,
      varietals: formData.varietals.filter((v) => v !== varietal),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }



    try {
      setError(null);
      onSave(formData, imageFile);
    } catch (err) {
      setError(err.message || "Failed to save wine");
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;

    if (window.confirm("Are you sure you want to delete this wine?")) {
      try {
        await MenuService.deleteWine(item.id);
        onClose();
      } catch (err) {
        setError(err.message || "Failed to delete wine");
      }
    }
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style.name);
    setFormData((prev) => ({
      ...prev,
      sub_category: style.name,
      style: {
        name: style.name,
        body: style.body,
        texture: style.texture,
        flavor_intensity: style.flavorIntensity || "",
        type: "",
        body_rank: "",
      },
    }));
  };

  const handleRestaurantSelect = (option) => {
    setSelectedRestaurant(option);
    setFormData({
      ...formData,
      restaurant: option.value,
    });
  };

  const handleVintageChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, vintage: value });
    // Live validation
    const year = Number(value);
    const currentYear = new Date().getFullYear();
    if (value && (isNaN(year) || year < 1800 || year > currentYear)) {
      setValidationErrors((prev) => ({
        ...prev,
        vintage: `Vintage must be between 1800 and ${currentYear}`,
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, vintage: undefined }));
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[50%] bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {item ? "Edit Wine Item" : "Add Wine Item"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Image Upload */}
        <div className="border bg-background border-dashed border-gray-300 rounded-lg p-4 text-center">
          <div className="flex flex-col items-center justify-center">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-gray-400 cursor-pointer"
            >
              {imagePreview ? "Change Image" : "Upload Image"}
            </label>
            <p className="text-sm text-gray-500 mt-2">Max file size: 5MB</p>
          </div>
        </div>

        {/* Producer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Producer Name*
          </label>
          <input
            type="text"
            name="producer_name"
            value={formData.producer_name}
            onChange={handleChange}
            className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors.producer_name ? "border-red-500" : ""
              }`}
            required
          />
          {validationErrors.producer_name && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.producer_name}
            </p>
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Product Name*
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors.product_name ? "border-red-500" : ""
              }`}
            required
          />
          {validationErrors.product_name && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.product_name}
            </p>
          )}
        </div>

        {/* Varietals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Varietals*
          </label>
          <div className="flex">
            <input
              type="text"
              value={newVarietal}
              onChange={(e) => setNewVarietal(e.target.value)}
              placeholder="Enter grapes in order of percentage, highest first (main grape first)"
              className={`flex-1 p-2 border bg-background border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors.varietals ? "border-red-500" : ""
                }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddVarietal();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddVarietal}
              className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-gray-400"
            >
              Add
            </button>
          </div>
          {validationErrors.varietals && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.varietals}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.varietals.map((varietal, index) => (
              <div
                key={index}
                className="flex items-center bg-iconbackground rounded-full px-3 py-1"
              >
                <span className="text-sm">{varietal}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVarietal(varietal)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Country*
            </label>
            <input
              type="text"
              name="region.country"
              value={formData?.region?.country}
              onChange={handleChange}
              placeholder="Country"
              className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors?.region?.country ? "border-red-500" : ""
                }`}
            />
            {validationErrors.region && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.region?.country}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Region*
            </label>
            <input
              type="text"
              name="region.region"
              value={formData?.region?.region}
              onChange={handleChange}
              placeholder="Region"
              className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors?.region?.region ? "border-red-500" : ""
                }`}
            />
          </div>
          {validationErrors.region && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors?.region?.region}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Sub Region
            </label>
            <input
              type="text"
              name="region.sub_region"
              value={formData?.region?.sub_region}
              onChange={handleChange}
              placeholder="Sub region"
              className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors?.region?.sub_region ? "border-red-500" : ""
                }`}
            />
          </div>
          {validationErrors.region && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors?.region?.sub_region}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Commune Appellation
            </label>
            <input
              type="text"
              name="region.commune_appellation"
              value={formData?.region?.commune_appellation}
              onChange={handleChange}
              placeholder="Commune Appellation"
              className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors?.region?.commune_appellation
                ? "border-red-500"
                : ""
                }`}
            />
          </div>
          {validationErrors.region && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors?.region?.commune_appellation}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Vineyard
            </label>
            <input
              type="text"
              name="region.vineyard"
              value={formData?.region?.vineyard}
              onChange={handleChange}
              placeholder="Vineyard"
              className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors?.region?.vineyard ? "border-red-500" : ""
                }`}
            />
          </div>
          {validationErrors.region && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors?.region?.vineyard}
            </p>
          )}
        </div>

        {/* Vintage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Vintage*
          </label>
          <input
            type="number"
            name="vintage"
            value={formData.vintage}
            onChange={handleVintageChange}
            required
            placeholder="Enter vintage year between 1800 - current year"
            className={`w-full p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors.vintage ? "border-red-500" : ""
              }`}
          />
          {validationErrors.vintage && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.vintage}
            </p>
          )}
        </div>

        {/* Restaurant Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Restaurant*
          </label>
          <select
            name="restaurant_uuid"
            value={formData.restaurant_uuid || ""}
            onChange={handleChange}
            className={`w-full p-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors.restaurant ? "border-red-500" : ""
              }`}
            required
          >
            <option value="">None</option>
            {restaurants.map((r) => (
              <option key={r.uuid} value={r.uuid}>
                {r.name}
              </option>
            ))}
          </select>
          {validationErrors.restaurant && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.restaurant}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Category*
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-2 bg-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${validationErrors.category ? "border-red-500" : ""
              }`}
            required
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {validationErrors.category && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.category}
            </p>
          )}
        </div>

        {/* Display Styles Based on Selected Category */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {filteredStyles.map((style) => {
            // For Red, Orange, Dessert: use base color directly. For others, lighten.
            const strongColorCats = ["Red", "Orange", "Dessert"];
            const baseColor = CATEGORY_BASE_COLORS[style.category] || "#eee";
            const hex = baseColor.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            let displayBg;
            if (strongColorCats.includes(style.category)) {
              displayBg = baseColor;
            } else {
              const lighten = (c) => Math.round(c + (255 - c) * 0.3);
              displayBg = `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`;
            }
            // Calculate luminance for text color
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const textColor = luminance < 0.6 ? "#fff" : "#222";
            const isSelected = selectedStyle === style.name;
            return (
              <div
                key={style.name}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-150 ${isSelected
                  ? style.category === "Red"
                    ? "border-4 border-[#222] ring-2 ring-[#222]"
                    : "border-4 border-primary ring-2 ring-primary"
                  : "border-transparent"
                  }`}
                style={{
                  backgroundColor: displayBg,
                  color: textColor,
                  boxShadow: isSelected
                    ? style.category === "Red"
                      ? "0 0 0 4px #222"
                      : "0 0 0 4px #e11d48"
                    : undefined,
                }}
                onClick={() => handleStyleSelect(style)}
              >
                <h3 className="font-semibold" style={{ color: textColor }}>
                  {style.name}
                </h3>
                <p>
                  <strong>Body:</strong> {style.body}
                </p>
                <p>
                  <strong>Texture:</strong> {style.texture}
                </p>
                <p>
                  <strong>Flavor Intensity:</strong> {style.flavorIntensity}
                </p>
              </div>
            );
          })}
          {validationErrors.style && (
            <p className="text-red-500 text-sm mt-1 col-span-2">
              {validationErrors.style}
            </p>
          )}
        </div>

        {/* Characteristics */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Characteristics
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_filtered"
              checked={formData.is_filtered}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Filtered</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="has_residual_sugar"
              checked={formData.has_residual_sugar}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Has Residual Sugar</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_organic"
              checked={formData.is_organic}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Organic</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_biodynamic"
              checked={formData.is_biodynamic}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Biodynamic</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_vegan"
              checked={formData.is_vegan}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Vegan</label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
            rows={3}
            className="w-full bg-background p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Status */}
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-textcolor"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {formData.status ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

        {/* Offering Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Offering
          </label>
          <div className="flex items-center space-x-4 mb-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="offering.by_the_glass"
                checked={formData.offering?.by_the_glass || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    offering: {
                      ...formData.offering,
                      by_the_glass: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span>By the Glass</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="offering.by_the_bottle"
                checked={formData.offering?.by_the_bottle || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    offering: {
                      ...formData.offering,
                      by_the_bottle: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span>By the Bottle</span>
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              name="offering.glass_price"
              value={formData.offering?.glass_price ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  offering: {
                    ...formData.offering,
                    glass_price:
                      e.target.value === "" ? null : Number(e.target.value),
                  },
                })
              }
              placeholder="Glass Price"
              className="w-1/2 p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={!formData.offering?.by_the_glass}
            />
            <input
              type="number"
              name="offering.bottle_price"
              value={formData.offering?.bottle_price ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  offering: {
                    ...formData.offering,
                    bottle_price:
                      e.target.value === "" ? null : Number(e.target.value),
                  },
                })
              }
              placeholder="Bottle Price"
              className="w-1/2 p-2 border bg-background border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={!formData.offering?.by_the_bottle}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-between space-x-2 pt-4">
          <div className="flex space-x-2">
            <Button type="button" variant="danger" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-gray-400"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : item ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
