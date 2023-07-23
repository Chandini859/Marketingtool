import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const SendingEmail = ({ closeEvent }) => {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
    files: [],
    categoryId: '',
    customer: '',
    option1: false,
    option2: false,
    option3: false,
  });

  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
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

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('to', formData.to);
    formDataToSend.append('cc', formData.cc);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('body', formData.body);

    Object.keys(formData.files).forEach((singleKey) => {
      formDataToSend.append(`file`, formData.files[singleKey]);
    });

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

      const response = await axios.post('http://localhost:8080/mail/send', formDataToSend);

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
    axios
      .get('http://localhost:8080/categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8080/customers')
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      categoryId: value,
      customer: '', // Reset customer selection when category changes
    }));
  };

  const handleCustomerChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      customer: value,
    }));
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
        name="customer" // <-- Match the name with the field in the state
        label="Customers"
        value={formData.customer}
        onChange={handleCustomerChange} // <-- Use the correct handleChange function
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
        select
      >
        {customers.map((customer) => (
          <MenuItem key={customer.customerId} value={customer.customerId}>
            {customer.customerId} - {customer.customerName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="to"
        label="To"
        value={formData.to}
        onChange={handleInputChange}
        sx={{ mb: 1, fontSize: '1rem' }}
        fullWidth
      />
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
      <Dialog open={isPreviewModalOpen} onClose={handleClosePreviewModal}>
        <DialogTitle>Email Preview</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">To: {formData.to}</Typography>
          <Typography variant="subtitle1">CC: {formData.cc}</Typography>
          <Typography variant="subtitle1">Subject: {formData.subject}</Typography>
          <Typography variant="body1">Body: {formData.body}</Typography>
          {formData.files.length > 0 &&
            formData.files.map((file, index) => (
              <div key={index}>
                Selected File {index + 1}: {file.name}
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreviewModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SendingEmail;
