import json
import matplotlib.pyplot as plt

with open('../src/assets/guitarChords.json') as file:
    data = json.load(file)

numofChords = data['main']['numberOfChords']

mostused = [0,0,0,0,0,0]
mostmuted = [0,0,0,0,0,0]

for key in data['chords']:
    for chord in data['chords'][key]:
        for pos in chord['positions']:
            for index,fret in enumerate(pos['frets']):
                if (fret==-1):
                    mostmuted[index]=mostmuted[index]+1
                else:
                    mostused[index]=mostused[index]+1

plt.style.use('ggplot')

x = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth']
x_pos = [i for i, _ in enumerate(x)]

plt.bar(x_pos, mostused, color='green')
plt.xlabel("String")
plt.ylabel("Occurences")
plt.title("Most used guitar strings")

plt.xticks(x_pos, x)

plt.show()

plt.bar(x_pos, mostmuted, color='green')
plt.xlabel("String")
plt.ylabel("Occurences")
plt.title("Most muted guitar strings")

plt.xticks(x_pos, x)

plt.show()
