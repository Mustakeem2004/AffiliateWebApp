import React, { useState } from 'react';

const ProductForm = ({ addProduct, editingProduct, updateProduct, cancelEdit, darkMode }) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    price: editingProduct?.price || '',
    category: editingProduct?.category || '',
    description: editingProduct?.description || '',
    amazonLink: editingProduct?.amazonLink || '',
    flipkartLink: editingProduct?.flipkartLink || '',
    image: editingProduct?.image || '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = 'Required';
    if (!formData.amazonLink.trim() && !formData.flipkartLink.trim()) newErrors.links = 'At least one link required';
    if (!formData.image.trim()) newErrors.image = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim() || 'General',
      description: formData.description.trim(),
      amazonLink: formData.amazonLink.trim(),
      flipkartLink: formData.flipkartLink.trim(),
      image: formData.image.trim(),
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData });
    } else {
      addProduct(productData);
    }
  };

  const inputClass = `w-full p-3 rounded-lg ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-gray-50 border-gray-200 text-gray-800'
  } border focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
      <h2 className={`text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {editingProduct ? 'Edit Product' : 'Add Product'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Product Name *"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={inputClass}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Price (₹) *"
            value={formData.price}
            onChange={(e) => updateField('price', e.target.value)}
            className={inputClass}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows="2"
            className={inputClass}
          />
        </div>

        <div>
          <input
            type="url"
            placeholder="Amazon Link"
            value={formData.amazonLink}
            onChange={(e) => updateField('amazonLink', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <input
            type="url"
            placeholder="Flipkart Link"
            value={formData.flipkartLink}
            onChange={(e) => updateField('flipkartLink', e.target.value)}
            className={inputClass}
          />
        </div>

        {errors.links && <p className="text-red-500 text-xs md:col-span-2">{errors.links}</p>}

        <div className="md:col-span-2">
          <input
            type="url"
            placeholder="Image URL *"
            value={formData.image}
            onChange={(e) => updateField('image', e.target.value)}
            className={inputClass}
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          {editingProduct ? 'Update' : 'Add Product'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={cancelEdit}
            className={`px-6 py-3 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
