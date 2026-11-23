import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import StorageService from './StorageService';
import NoteItem from './NoteItem';
import styles from './styles';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // READ: Load saved notes once when the app first opens.
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await StorageService.getNotes();
      setNotes(savedNotes);
    } catch (error) {
      Alert.alert('Loading Error', 'Could not load your saved notes.');
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async (updatedNotes) => {
    setSaving(true);
    try {
      await StorageService.saveNotes(updatedNotes);
      setNotes(updatedNotes);
    } catch (error) {
      Alert.alert('Saving Error', 'Your changes could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please enter both a title and note.');
      return;
    }

    if (editingId) {
      // UPDATE: Replace the edited note, then save the full array.
      const updatedNotes = notes.map((note) =>
        note.id === editingId
          ? { ...note, title: title.trim(), content: content.trim(), updatedAt: new Date().toISOString() }
          : note
      );
      await saveNotes(updatedNotes);
    } else {
      // CREATE: Add a new note, then save the full array.
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      await saveNotes([newNote, ...notes]);
    }

    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          // DELETE: Remove the note, then save the updated array.
          const updatedNotes = notes.filter((note) => note.id !== id);
          await saveNotes(updatedNotes);
          if (editingId === id) {
            setTitle('');
            setContent('');
            setEditingId(null);
          }
        },
      },
    ]);
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading your notes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FC" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
          <Text style={styles.heading}>NoteFlow</Text>
          <Text style={styles.subtitle}>Keep your thoughts and tasks in one place.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formHeading}>{editingId ? 'Edit note' : 'Create a note'}</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Note title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            maxLength={60}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="Write your note here..."
            placeholderTextColor="#9CA3AF"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.formActions}>
            {editingId ? (
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit} disabled={saving}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.submitButton, saving && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={styles.submitButtonText}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : '+ Add Note'}
              </Text>
            </TouchableOpacity>
          </View>
          {saving ? <Text style={styles.savingText}>Saving your changes to this device...</Text> : null}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listHeading}>My Notes</Text>
          <Text style={styles.noteCount}>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</Text>
        </View>

        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✎</Text>
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>Create your first note above. It will stay saved on this device.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
