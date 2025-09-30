import React from "react";
import { Modal, Box, Typography, Card, CardContent, IconButton, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Delete, Close } from "@mui/icons-material";

const CommentsModal = ({ show, onHide, comments, handleDeleteComment }) => {
  return (
    <Modal open={show} onClose={onHide}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="modal"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          padding: 24,
          borderRadius: 12,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ color: "#1a202c" }}>
            Comentarios
          </Typography>
          <IconButton onClick={onHide} sx={{ color: "#718096" }}>
            <Close />
          </IconButton>
        </Box>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} sx={{ mb: 2, bgcolor: "#f7fafc" }}>
              <CardContent>
                <Typography variant="body1" sx={{ color: "#1a202c" }}>
                  {comment.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Por: {comment.user}
                </Typography>
                <Box mt={1}>
                  <Button
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography sx={{ color: "#4a5568" }}>No hay comentarios disponibles.</Typography>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onHide}
            sx={{ color: "#718096", borderColor: "#e2e8f0" }}
          >
            Cerrar
          </Button>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default CommentsModal;