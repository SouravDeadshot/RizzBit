import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CandidateProfile } from './InsideZoneScreen';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface ChatScreenProps {
  matchedUser: CandidateProfile;
  zoneName?: string;
  isOutsideZone?: boolean;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  matchedUser,
  zoneName,
  isOutsideZone = false,
  onBack,
}) => {
  const displayZone = zoneName || matchedUser.matchedZoneName || 'Nexus Grand Mall';
  const avatarChar = matchedUser.avatarLetter || matchedUser.name.charAt(0);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'them',
      text:
        matchedUser.lastMessage ||
        (isOutsideZone
          ? `Hey! Great matching with you in ${displayZone}! Chat is active whenever you want to talk.`
          : `Hey! I saw you're in ${displayZone} too! Free to hang out right now?`),
      time: matchedUser.lastMessageTime || 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate reply from the person
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: isOutsideZone
            ? 'Sounds great! Let’s definitely catch up soon ✨'
            : 'Awesome, see you there! Look for me in the terrace lounge 👋',
          time: 'Just now',
        },
      ]);
    }, 1500);
  };

  const handleIcebreaker = (phrase: string) => {
    setInputText(phrase);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>
            {matchedUser.name}, {matchedUser.age}
          </Text>
          <Text style={styles.headerSpot}>
            {isOutsideZone
              ? `🔒 Met at ${displayZone} • Active Anywhere`
              : `📍 Active in ${displayZone}`}
          </Text>
        </View>

        <View style={[styles.avatarBadge, { backgroundColor: matchedUser.avatarColor }]}>
          <Text style={styles.avatarText}>{avatarChar}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubbleWrapper,
                item.sender === 'me' ? styles.bubbleMeWrapper : styles.bubbleThemWrapper,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  item.sender === 'me' ? styles.bubbleMe : styles.bubbleThem,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    item.sender === 'me' ? styles.bubbleTextMe : styles.bubbleTextThem,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          )}
        />

        {/* Quick In-Person Meet Prompts */}
        <View style={styles.icebreakerRow}>
          {isOutsideZone ? (
            <>
              <TouchableOpacity
                style={styles.icebreakerPill}
                onPress={() => handleIcebreaker('Hey! Free for coffee this week? ☕')}
              >
                <Text style={styles.icebreakerText}>☕ Coffee this week?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.icebreakerPill}
                onPress={() => handleIcebreaker('Are you still nearby the zone? 👋')}
              >
                <Text style={styles.icebreakerText}>👋 Still nearby?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.icebreakerPill}
                onPress={() => handleIcebreaker('How is your day going? ✨')}
              >
                <Text style={styles.icebreakerText}>✨ How’s your day?</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.icebreakerPill}
                onPress={() => handleIcebreaker('Hey! Grab a coffee right now? ☕')}
              >
                <Text style={styles.icebreakerText}>☕ Grab Coffee</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.icebreakerPill}
                onPress={() => handleIcebreaker("I'm by the food court, come say hi! 👋")}
              >
                <Text style={styles.icebreakerText}>👋 Food Court</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.icebreakerPill}
                onPress={() => handleIcebreaker('Up for a game at the arcade? 🎳')}
              >
                <Text style={styles.icebreakerText}>🎳 Play Arcade</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={`Message ${matchedUser.name}...`}
            placeholderTextColor="#64748b"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0715',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 75, 110, 0.2)',
    backgroundColor: '#120822',
  },
  backBtn: {
    paddingRight: 14,
  },
  backText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSpot: {
    color: '#00f0ff',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  avatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  bubbleWrapper: {
    marginBottom: 8,
  },
  bubbleMeWrapper: {
    alignItems: 'flex-end',
  },
  bubbleThemWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: '#ff4b6e',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#1e1333',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: '#ffffff',
    fontWeight: '500',
  },
  bubbleTextThem: {
    color: '#f1f5f9',
  },
  timeText: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  icebreakerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  icebreakerPill: {
    backgroundColor: '#1b102e',
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 110, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  icebreakerText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#120822',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1c1032',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4b6e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
});
