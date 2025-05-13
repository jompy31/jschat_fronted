import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";

const PipelineView = ({ leads, onDragEnd }) => {
  const stages = [
    { id: "nuevo", title: "Nuevo", color: "info" },
    { id: "contactado", title: "Contactado", color: "warning" },
    { id: "ganado", title: "Ganado", color: "success" },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                {leads
                  .filter((lead) => lead.status === stage.id)
                  .map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id.toString()} index={index}>
                      {(provided) => (
                        <Card
                          sx={{ mb: 2 }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CardContent>
                            <Typography variant="body1">{lead.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.email}
                            </Typography>
                            <Chip
                              label={lead.priority}
                              color={lead.priority === "alto" ? "error" : "default"}
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
    </DragDropContext>
  );
};

export default PipelineView;