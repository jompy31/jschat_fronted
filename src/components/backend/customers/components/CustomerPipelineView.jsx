// frontend_github\jschat_fronted\src\components\backend\customers\components\CustomerPipelineView.jsx
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const CustomerPipelineView = ({ customers }) => {
  const stages = [
    { id: "Cliente", title: "Clientes", color: "info" },
    { id: "Proveedor", title: "Proveedores", color: "warning" },
  ];

  return (
    <Box display="flex" gap={3} sx={{ overflowX: "auto", p: 3, pb: 4 }}>
      {stages.map((stage) => (
        <Droppable key={stage.id} droppableId={stage.id}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minWidth: 320,
                bgcolor: 'var(--bg-secondary)',
                p: 3,
                borderRadius: 3,
                border: `1px solid var(--border-primary)`,
                boxShadow: 'var(--shadow-light)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {stage.title}
              </Typography>

              {customers
                .filter((c) => c && c.tipo_contacto === stage.id && c.name)
                .map((customer, index) => (
                  <Draggable key={customer.id} draggableId={customer.id.toString()} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          mb: 2,
                          background: 'var(--bg-primary)',
                          border: `1px solid var(--border-primary)`,
                          boxShadow: 'var(--shadow-light), var(--glow-neon)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 'var(--glow-neon)',
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                            {customer.email || "Sin correo"}
                          </Typography>
                          <Chip
                            label={customer.tipo_contacto}
                            size="small"
                            sx={{
                              mt: 1,
                              background: 'var(--accent-hover)',
                              color: '#fff',
                              fontWeight: 600,
                              '&:hover': { background: 'var(--accent-primary)' }
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