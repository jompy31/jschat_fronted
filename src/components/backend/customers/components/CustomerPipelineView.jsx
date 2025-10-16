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
        <Droppable
          key={stage.id}
          droppableId={stage.id}
          isDropDisabled={false} // ✅ Corregido para evitar el error
        >
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minWidth: 300,
                bgcolor: "var(--bg-secondary)",
                p: 2,
                borderRadius: 2,
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-light)",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "var(--text-primary)" }}>
                {stage.title}
              </Typography>

              {customers
                .filter((customer) => customer && customer.tipo_contacto === stage.id && customer.name)
                .map((customer, index) => (
                  <Draggable key={customer.id} draggableId={customer.id.toString()} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          mb: 2,
                          background: "var(--bg-primary)",
                          border: "1px solid var(--border-primary)",
                          boxShadow: "var(--shadow-light), var(--glow-neon)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "var(--glow-neon)",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1" sx={{ color: "var(--text-primary)" }}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                            {customer.email || "Sin correo"}
                          </Typography>
                          <Chip
                            label={customer.tipo_contacto}
                            color={stage.color}
                            size="small"
                            sx={{
                              mt: 1,
                              background: "var(--accent-hover)",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-primary)",
                              "&:hover": {
                                background: "var(--border-primary)",
                                borderColor: "var(--accent-primary)",
                                boxShadow: "var(--glow-neon)",
                              },
                            }}
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
