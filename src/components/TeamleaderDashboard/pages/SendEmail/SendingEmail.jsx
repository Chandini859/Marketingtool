import { Box, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const SendingEmail = ({ closeEvent }) => {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
    senderId: '',
    files: [],
    categoryId: '',
    subcategoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [subCategoryCustomers, setSubCategoryCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, files: [...prevData.files, ...e.target.files] }));
  };

  const removeFile = (index) => {
    setFormData((prevData) => {
      const newFiles = [...prevData.files];
      newFiles.splice(index, 1);
      return { ...prevData, files: newFiles };
    });
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('to', selectedCustomers.join(', '));
    formDataToSend.append('cc', formData.cc);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('body', formData.body);
    formDataToSend.append('senderId', formData.senderId);

    Object.keys(formData.files).forEach((singleKey) => {
      formDataToSend.append(`file`, formData.files[singleKey]);
    });

    // Append selected customer IDs to the formDataToSend
    formDataToSend.append('customers', JSON.stringify(selectedCustomers));

    try {
      Swal.fire({
        title: 'Sending Email...',
        text: 'Please wait while the email is being sent.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post('http://localhost:8080/Email/send', formDataToSend);

      Swal.fire({
        icon: 'success',
        title: 'Mail Sent Successfully',
        text: 'Your email has been sent successfully!',
      });

      console.log(response.data);
      closeEvent();
    } catch (err) {
      console.error(err.response.data);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Oops, something went wrong. Please try again later.',
      });
    }
  };

  useEffect(() => {
    // Fetch categories on component mount
    axios
      .get('http://localhost:8080/categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      categoryId: value,
      subcategoryId: '', // Reset subcategoryId when a new category is selected
    }));

    // Fetch subcategories based on the selected category
    axios
      .get(`http://localhost:8080/subcategory`)
      .then((res) => {
        setSubcategories(res.data);
        setSubCategoryCustomers([]);
        setSelectedCustomers([]); // Reset selected customers when a new category is selected
      })
      .catch((error) => {
        console.error(error);
        setSubcategories([]);
        setSubCategoryCustomers([]);
        setSelectedCustomers([]);
      });
  };

  const handleSubcategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      subcategoryId: value, // Update subcategoryId in formData
    }));

    // Fetch customers based on the selected subcategory
    axios
      .get(`http://localhost:8080/customers/customers/${value}`)
      .then((res) => {
        setSubCategoryCustomers(res.data);
        setSelectedCustomers([]); // Reset selected customers when a new subcategory is selected
      })
      .catch((error) => {
        console.error(error);
        setSubCategoryCustomers([]);
      });
  };

  const handleCustomerCheckboxChange = (customerId) => (event) => {
    const { checked } = event.target;
    setSelectedCustomers((prevSelected) =>
      checked
        ? [...prevSelected, customerId]
        : prevSelected.filter((id) => id !== customerId)
    );
  };

  const handleSelectAllCustomers = (event) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedCustomers(subCategoryCustomers.map((customer) => customer.customerId));
    } else {
      setSelectedCustomers([]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
      <Typography variant="h6" component="div" sx={{ mb: 1, fontSize: '1.5rem' }}>
        Email
      </Typography>
      <TextField
        name="subject"
        label="Title"
        value={formData.subject}
        onChange={handleInputChange}
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
      />

      <TextField
        id="categoryId"
        label="Category Name"
        variant="outlined"
        size="small"
        value={formData.categoryId}
        onChange={handleCategoryChange}
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
        select
      >
        {categories.map((category) => (
          <MenuItem key={category.categoryId} value={category.categoryId}>
            {category.categoryName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="subcategoryId"
        label="Subcategory Name"
        variant="outlined"
        size="small"
        value={formData.subcategoryId}
        onChange={handleSubcategoryChange}
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
        select
      >
        {subcategories.map((subcategory) => (
          <MenuItem key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
            {subcategory.subcategoryName}
          </MenuItem>
        ))}
      </TextField>

      {subCategoryCustomers.length > 0 && (
        <Box sx={{ mt: 2, maxHeight: '200px', overflowY: 'auto' }}>
          <Typography variant="body1">
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCustomers.length === subCategoryCustomers.length}
                  onChange={handleSelectAllCustomers}
                />
              }
              label="Select All"
            />
          </Typography>
          <FormGroup>
            {subCategoryCustomers.map((customer) => (
              <FormControlLabel
                key={customer.customerId}
                control={
                  <Checkbox
                    value={customer.customerId}
                    checked={selectedCustomers.includes(customer.customerId)}
                    onChange={handleCustomerCheckboxChange(customer.customerId)}
                  />
                }
                label={`${customer.customerName}`}
              />
            ))}
          </FormGroup>
        </Box>
      )}

      {/* <TextField
        name="senderId"
        label="SenderId"
        value={formData.senderId}
        onChange={handleInputChange}
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
      />  */}
      <TextField
        name="cc"
        label="CC"
        value={formData.cc}
        onChange={handleInputChange}
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
      />
      <TextField
        name="body"
        label="Add Message"
        multiline
        rows={2}
        minRows={2}
        value={formData.body}
        onChange={handleInputChange}
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: '8px' }}
      />
      <Typography variant="body2" sx={{ mb: 1, fontSize: '1rem' }}>
        {formData.files.length > 0 &&
          formData.files.map((file, index) => (
            <div key={index}>
              Selected File {index + 1}: {file.name}
              <Button variant="outlined" size="small" onClick={() => removeFile(index)}>
                Remove
              </Button>
            </div>
          ))}
      </Typography>
      <Button variant="contained" onClick={handlePreview} sx={{ width: '100px', mb: 1 }}>
        Preview
      </Button>
      <Button variant="contained" onClick={handleSubmit} sx={{ width: '100px', mb: 1 }}>
        Submit
      </Button>

       {/* Preview Modal */}
       {isPreviewModalOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <Box sx={{ backgroundColor: 'white', padding: '20px', maxWidth: '600px', width: '100%', borderRadius: '8px', zIndex: 10000 }}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Preview Email
            </Typography>
            {formData.cc && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>CC:</strong> {formData.cc}
              </Typography>
            )}
            {formData.subject && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Title:</strong> {formData.subject}
              </Typography>
            )}
            {formData.body && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Body:</strong> {formData.body}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Customers Count:</strong> {selectedCustomers.length}
            </Typography>
            {formData.files.length > 0 && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Selected Files:</strong>
                {formData.files.map((file, index) => (
                  <div key={index}>
                    {file.name}
                  </div>
                ))}
              </Typography>
            )}
            <Button variant="contained" onClick={handleClosePreviewModal} sx={{ width: '100px', mt: 2 }}>
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SendingEmail;