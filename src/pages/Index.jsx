import React, { useState } from "react";
import { Box, Heading, Text, Button, Input, Stack, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddCategory = (category) => {
    setCategories([...categories, category]);
    onClose();
  };

  const handleAddProduct = (product) => {
    setProducts([...products, { ...product, category: selectedCategory }]);
    onClose();
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map((product) => (product === selectedProduct ? updatedProduct : product)));
    onClose();
  };

  const handleDeleteProduct = (productToDelete) => {
    setProducts(products.filter((product) => product !== productToDelete));
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Stock Tracking App
      </Heading>

      <Stack direction="row" spacing={4} mb={4}>
        <Button
          leftIcon={<FaPlus />}
          onClick={() => {
            setSelectedCategory(null);
            onOpen();
          }}
        >
          Add Category
        </Button>
        <Button
          leftIcon={<FaPlus />}
          onClick={() => {
            setSelectedProduct(null);
            onOpen();
          }}
          isDisabled={!selectedCategory}
        >
          Add Product
        </Button>
      </Stack>

      <Stack direction="row" spacing={4} mb={4}>
        {categories.map((category) => (
          <Button key={category} onClick={() => setSelectedCategory(category)} variant={selectedCategory === category ? "solid" : "outline"}>
            {category}
          </Button>
        ))}
      </Stack>

      {selectedCategory && (
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            {selectedCategory}
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th isNumeric>Units</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products
                .filter((product) => product.category === selectedCategory)
                .map((product) => (
                  <Tr key={product.name}>
                    <Td>{product.name}</Td>
                    <Td isNumeric>{product.units}</Td>
                    <Td>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        mr={2}
                        onClick={() => {
                          setSelectedProduct(product);
                          onOpen();
                        }}
                      />
                      <IconButton icon={<FaTrash />} aria-label="Delete" onClick={() => handleDeleteProduct(product)} />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProduct ? "Edit Product" : selectedCategory ? "Add Product" : "Add Category"}</ModalHeader>
          <ModalBody>
            {selectedProduct || selectedCategory ? (
              <>
                <FormControl id="name" mb={4}>
                  <FormLabel>Product Name</FormLabel>
                  <Input defaultValue={selectedProduct?.name} placeholder="Enter product name" />
                </FormControl>
                <FormControl id="units">
                  <FormLabel>Units</FormLabel>
                  <Input defaultValue={selectedProduct?.units} placeholder="Enter units" type="number" />
                </FormControl>
              </>
            ) : (
              <FormControl id="category">
                <FormLabel>Category Name</FormLabel>
                <Input placeholder="Enter category name" />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                const formData = new FormData(document.querySelector("form"));
                const data = Object.fromEntries(formData.entries());
                if (selectedProduct) {
                  handleUpdateProduct({
                    ...selectedProduct,
                    ...data,
                    units: parseInt(data.units),
                  });
                } else if (selectedCategory) {
                  handleAddProduct({
                    name: data.name,
                    units: parseInt(data.units),
                  });
                } else {
                  handleAddCategory(data.category);
                }
              }}
            >
              {selectedProduct ? "Update" : "Add"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
