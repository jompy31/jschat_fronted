import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const CustomerPipelineView = ({ customers }) => {
  const stages = [
    { id: "Cliente", title: "Clientes", color: "info" },
    { id: "Proveedor", title: "Proveedores", color: "warning" },
  ];

  return (
    <Box display="flex" gap={2} sx={{ overflowX: "auto", p: 2 }}>
      {stages.map((stage) => (
        <Droppable key={stage.id} droppableId={stage.id}>
          {(provided) => (
            <Box
              sx={{
                minWidth: 300,
                bgcolor: "#f5f5f5",
                p: 2,
                borderRadius: 2,
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Typography variant="h6" gutterBottom>
                {stage.title}
              </Typography>
              {customers
                .filter((customer) => customer && customer.tipo_contacto === stage.id && customer.name)
                .map((customer, index) => (
                  <Draggable key={customer.id} draggableId={customer.id.toString()} index={index}>
                    {(provided) => (
                      <Card
                        sx={{ mb: 2 }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <CardContent>
                          <Typography variant="body1">{customer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.email || "Sin correo"}
                          </Typography>
                          <Chip
                            label={customer.tipo_contacto}
                            color={stage.color}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      ))}
    </Box>
  );
};

export default CustomerPipelineView;