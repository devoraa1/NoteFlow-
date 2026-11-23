import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <View style={styles.noteCard}>
      <View style={styles.noteTextArea}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text style={styles.noteContent}>{note.content}</Text>
        <Text style={styles.noteDate}>
          {note.updatedAt ? 'Updated' : 'Created'}: {new Date(note.updatedAt || note.createdAt).toLocaleString()}
        </Text>
      </View>
      <View style={styles.noteActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(note)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(note.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
