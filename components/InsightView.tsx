
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, PenLine, Sparkles, ArrowRight, Library, Info, Eye, ClipboardList, Zap, Quote } from 'lucide-react';

interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

interface StepQuestion {
  question: string;
  options: Option[];
}

interface WisdomItem {
  sage: string;
  source: string;
}

interface StepData {
  title: string;
  questions: StepQuestion[];
  subjectiveQuestion: string;
  statusSummary: string;
  mechanism: string;
  wisdoms: WisdomItem[];
  common: string;
  bridgePhrase: string;
  transitionPrompt: string;
  nextStepTitle: string;
}

interface LevelData {
  id: number;
  name: string;
  theme: string;
  color: string;
  bg: string;
  btnBg: string;
  steps: StepData[];
}

const INSIGHT_DATA: LevelData[] = [
  {
    id: 1, 
    name: "파괴", 
    theme: "수치심 · 죄의식 · 자기부정", 
    color: "text-rose-600", 
    bg: "bg-rose-50",
    btnBg: "bg-rose-600",
    steps: [
      {
        title: "나는 지금 무엇을 느끼고 있는가",
        questions: [
          { question: "요즘 나 자신을 떠올릴 때 가장 먼저 드는 감정은?", options: [{ id: 'A', text: "부끄러움" }, { id: 'B', text: "죄책감" }, { id: 'C', text: "공허함" }, { id: 'D', text: "잘 모르겠다" }] },
          { question: "이 감정은 나에게 어떤 메시지를 주고 있나요?", options: [{ id: 'A', text: "나는 잘못된 사람이다" }, { id: 'B', text: "나는 자격이 없다" }, { id: 'C', text: "나는 버려질 수 있다" }, { id: 'D', text: "그냥 이런 상태일 뿐이다" }] },
          { question: "이 감정은 하루 중 언제 가장 강해지나요?", options: [{ id: 'A', text: "혼자 있을 때" }, { id: 'B', text: "사람들과 비교할 때" }, { id: 'C', text: "실수했을 때" }, { id: 'D', text: "이유 없이 갑자기" }] },
          { question: "이 감정이 올라올 때, 몸에서 가장 먼저 느껴지는 반응은?", options: [{ id: 'A', text: "가슴이 조여온다" }, { id: 'B', text: "배나 명치가 답답하다" }, { id: 'C', text: "머리가 멍해진다" }, { id: 'D', text: "잘 느껴지지 않는다" }] },
        ],
        subjectiveQuestion: "지금 이 순간, 이 감정을 한 단어(또는 짧은 문장)로 적어본다면?",
        statusSummary: "현재 당신은 특정 감정 속에 머물러 있습니다. 이 단계에서는 감정의 파도가 높아, 당신이라는 존재 자체가 그 감정과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "이것은 '동일시'라 불리는 상태입니다. 마치 폭풍우가 치는 날씨를 보고 '하늘 자체가 폭풍'이라고 믿는 것과 같습니다. 지금의 무거움은 당신의 본질이 아니라, 당신의 의식을 지나가고 있는 구름일 뿐입니다.",
        wisdoms: [
          { sage: "오온이 모두 비어 있음을 비추어 보고 온갖 괴로움에서 벗어났느니라", source: "부처 | 반야심경" },
          { sage: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", source: "예수 | 마태복음 11:28" }
        ],
        common: "고통은 그것이 '나'라는 착각에서 비롯된 무거운 짐입니다. 그 짐이 실체가 없음을 깨닫고(공) 온전히 내어맡길 때(쉼), 비로소 영혼은 깊은 안식에 닿습니다.",
        bridgePhrase: "이 감정이 곧 ‘나’가 아니라는 것을 아주 잠깐이라도 느꼈다면 다음으로 떠오르는 질문은 이것입니다.",
        transitionPrompt: "그렇다면 나는 나를 왜 이렇게 대하고 있었을까",
        nextStepTitle: "나는 나를 어떻게 대하고 있는가",
      },
      {
        title: "나는 나를 어떻게 대하고 있는가",
        questions: [
          { question: "실수했을 때, 나에게 가장 자주 하는 말은?", options: [{ id: 'A', text: "“왜 항상 이 모양이야”" }, { id: 'B', text: "“괜찮아, 다음엔 잘하자”" }, { id: 'C', text: "아무 말도 하지 않는다" }, { id: 'D', text: "스스로를 무시한다" }] },
          { question: "그 말의 톤은 어떤가요?", options: [{ id: 'A', text: "공격적" }, { id: 'B', text: "체념적" }, { id: 'C', text: "무감각" }, { id: 'D', text: "따뜻함" }] },
          { question: "그 말을 들은 ‘나는’ 보통 어떻게 반응하나요?", options: [{ id: 'A', text: "더 움츠러든다" }, { id: 'B', text: "아무 느낌도 안 든다" }, { id: 'C', text: "억지로 버틴다" }, { id: 'D', text: "잠깐 숨이 트인다" }] },
          { question: "만약 친한 사람이 같은 실수를 했다면?", options: [{ id: 'A', text: "위로했을 것이다" }, { id: 'B', text: "조언했을 것이다" }, { id: 'C', text: "비슷하게 비난했을 것이다" }, { id: 'D', text: "상황에 따라 다르다" }] },
        ],
        subjectiveQuestion: "내가 나에게 가장 자주 하는 말 한 문장을 그대로 적어본다면?",
        statusSummary: "현재 당신은 스스로를 향한 날카로운 비난 속에 머물러 있습니다. 이 단계에서는 자책의 목소리가 너무나 익숙하여, 당신이라는 존재 자체가 그 가혹한 심판관과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "여기서 중요한 질문은 ‘왜 이렇게 느끼는가’가 아니라 ‘왜 이렇게 나를 대하는가’입니다. 자신을 향한 비난은 성격이 아니라 과거로부터 습득된 행동 패턴일 가능성이 높습니다.",
        wisdoms: [
          { sage: "네 이웃을 네 자신과 같이 사랑하라", source: "예수 | 마태복음 22:39" },
          { sage: "어느 곳을 찾아보아도 나 자신보다 소중한 것은 없나니 그러므로 자신을 사랑하는 사람은 남을 해치지 말아야 한다", source: "부처 | 상윳타 니카야" }
        ],
        common: "자신을 적으로 대하는 한 고통은 반복됩니다. 자기 연민은 약함이 아니라 가장 강력한 치유의 시작입니다. 자신을 사랑하는 마음이 모든 관계와 영적 성장의 가장 정직한 출발점입니다.",
        bridgePhrase: "이 목소리가 항상 당신의 것은 아니었다는 사실이 조금 느껴지기 시작했다면, 다음 질문이 자연스럽게 떠오릅니다.",
        transitionPrompt: "이 말은 정말 내 목소일까",
        nextStepTitle: "이 목소리는 정말 나의 것인가",
      },
      {
        title: "이 목소리는 정말 나의 것인가",
        questions: [
          { question: "이 목소리는 누구를 닮아 있나요?", options: [{ id: 'A', text: "부모" }, { id: 'B', text: "사회 / 기준" }, { id: 'C', text: " 과거의 특정 인물" }, { id: 'D', text: "모르겠다" }] },
          { question: "이 목소리는 언제 가장 강해졌나요?", options: [{ id: 'A', text: "어릴 때" }, { id: 'B', text: "실패 이후" }, { id: 'C', text: "비교당했을 때" }, { id: 'D', text: "기억나지 않는다" }] },
          { question: "이 목소리는 보통 어떤 상황에서 등장하나요?", options: [{ id: 'A', text: "혼자 있을 때" }, { id: 'B', text: "평가받는 순간" }, { id: 'C', text: "실수 직후" }, { id: 'D', text: "예측할 수 없다" }] },
          { question: "이 목소리가 사라진다면, 가장 먼저 드는 감정은?", options: [{ id: 'A', text: "불안" }, { id: 'B', text: "편안함" }, { id: 'C', text: "공허함" }, { id: 'D', text: "상상하기 어렵다" }] },
        ],
        subjectiveQuestion: "이 목소리가 말을 한다면, 누구의 말투와 가장 비슷한가요?",
        statusSummary: "현재 당신은 타인의 목소리가 이식된 낡은 기준 속에 머물러 있습니다. 이 단계에서는 외부의 요구가 너무 절대적이어서, 당신이라는 존재 자체가 그 타인의 시선과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "이 사실을 인식한 순간, 그 목소리는 절대적인 힘을 잃기 시작합니다. 외부에서 유입된 목소리와 당신 본연의 의지를 분리하는 작업이 필요합니다.",
        wisdoms: [
          { sage: "불휘 기픈 남간 바라매 아니 뮐쌔", source: "세종대왕 | 용비어천가" },
          { sage: "진리를 알지니 진리가 너희를 자유롭게 하리라", source: "예수 | 요한복음 8:32" }
        ],
        common: "나의 것이 아닌 것을 나라고 믿는 착각에서 고통이 생깁니다. 근원을 알면 영향력은 줄어듭니다. 내면의 비난이 타인의 목소리였음을 아는 진실이 당신을 자유롭게 합니다.",
        bridgePhrase: "이제 자연스럽게 이 질문이 남습니다.",
        transitionPrompt: "그렇다면 나는 왜 나를 숨기게 되었을까",
        nextStepTitle: "나는 왜 나를 숨기려 하는가",
      },
      {
        title: "나는 왜 나를 숨기려 하는가",
        questions: [
          { question: "사람들이 나를 진짜로 안다면 어떨까요?", options: [{ id: 'A', text: "실망할 것이다" }, { id: 'B', text: "떠날 것이다" }, { id: 'C', text: "부담스러워할 것이다" }, { id: 'D', text: "잘 모르겠다" }] },
          { question: "그래서 당신은 보통 어떻게 하나요?", options: [{ id: 'A', text: "감정을 숨긴다" }, { id: 'B', text: "맞춰준다" }, { id: 'C', text: "거리를 둔다" }, { id: 'D', text: "혼자 버틴다" }] },
          { question: "이 선택은 처음부터 의식적인 것이었나요?", options: [{ id: 'A', text: "그렇다" }, { id: 'B', text: "어느 순간부터 자동이 됐다" }, { id: 'C', text: "잘 모르겠다" }, { id: 'D', text: "아니었다" }] },
          { question: "이 방식은 결과적으로 당신을 어떻게 만드나요?", options: [{ id: 'A', text: "보호한다" }, { id: 'B', text: "더 고립시킨다" }, { id: 'C', text: "둘 다" }, { id: 'D', text: "판단하기 어렵다" }] },
        ],
        subjectiveQuestion: "나를 숨기지 않았던 마지막 기억이 있다면, 언제였나요?",
        statusSummary: "현재 당신은 스스로 세운 높은 벽 속에 머물러 있습니다. 이 단계에서는 '숨겨야 한다'는 압박이 너무 강렬하여, 당신이라는 존재 자체가 그 견고한 가면과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "다만 지금 떠오른 질문은 이것입니다. “이 선택이 아직도 필요할까?” 과거의 보호 기제가 현재의 성장을 가로막는 장애물이 되고 있지는 않은지 살펴야 합니다.",
        wisdoms: [
          { sage: "빛이 어둠에 비치되 어둠이 깨닫지 못하더라", source: "사도 요한 | 요한복음 1:5" },
          { sage: "그대에게 일어나는 일을 막을 수는 없으나 그 일에 대한 그대의 판단은 그대가 다스릴 수 있다", source: "에픽테토스 | 담론록" }
        ],
        common: "가면을 벗는 것은 위험해 보이지만, 실제로는 진정한 연결을 향한 유일한 길입니다. 수치심은 어둠 속에서 자라나지만, 당신의 정직한 빛 아래서는 그 힘을 잃고 맙니다.",
        bridgePhrase: "여기까지 온 사람은 결국 이 질문 앞에 섭니다.",
        transitionPrompt: "이 감정이 없다면 나는 누구일까",
        nextStepTitle: "이 감정이 없다면, 나는 누구인가",
      },
      {
        title: "이 감정이 없다면, 나는 누구인가",
        questions: [
          { question: "이 감정이 사라진 나를 상상하면 어떤가요?", options: [{ id: 'A', text: "공허하다" }, { id: 'B', text: "두렵다" }, { id: 'C', text: "가볍다" }, { id: 'D', text: "상상되지 않는다" }] },
          { question: "그럼에도 불구하고 미세하게 느껴지는 것은?", options: [{ id: 'A', text: "호기심" }, { id: 'B', text: "저항" }, { id: 'C', text: "안도감" }, { id: 'D', text: "아무것도 없음" }] },
          { question: "이 질문 앞에서 가장 강한 반응은 무엇인가요?", options: [{ id: 'A', text: "불안" }, { id: 'B', text: "혼란" }, { id: 'C', text: "미세한 평온" }, { id: 'D', text: "말로 설명하기 어렵다" }] },
          { question: "이 감정이 ‘전부’가 아닐 수도 있다는 생각에 대해?", options: [{ id: 'A', text: "받아들이기 어렵다" }, { id: 'B', text: "어렴풋이 느껴진다" }, { id: 'C', text: "조금 편해진다" }, { id: 'D', text: "잘 모르겠다" }] },
        ],
        subjectiveQuestion: "이 감정 없이도 남아 있을 것 같은 ‘나의 흔적’이 있다면 무엇일까요?",
        statusSummary: "현재 당신은 고통의 서사가 균열을 일으키는 틈새 속에 머물러 있습니다. 이 단계에서는 과거의 정의가 힘을 잃어가며, 당신이라는 존재 자체가 그 낯선 자유의 공백과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "이 틈은 아직 빛은 아닙니다. 그러나 더 이상 완전히 닫힌 감옥도 아닙니다. 고통과의 동일시가 해체되기 시작하는 지점입니다.",
        wisdoms: [
          { sage: "모든 유위법은 꿈과 같고 환상과 같으며 이슬과 같고 번개와 같으니라", source: "부처 | 금강경" },
          { sage: "이전 것은 지나갔으니 보라 새 것이 되었도다", source: "사도 바울 | 고린도후서 5:17" }
        ],
        common: "고정된 자아는 없습니다. 매 순간 흐르는 의식만이 있을 뿐입니다. 낡은 감정의 옷을 벗어던질 때, 당신은 비로소 새로운 존재로 거듭날 수 있습니다.",
        bridgePhrase: "이 틈을 오래 바라본 사람들은 다음으로 이런 감각에 닿았습니다.",
        transitionPrompt: "나는 지쳐 있었구나",
        nextStepTitle: "Level 2 · 무력 — 나는 언제부터 지쳐 있었는가",
      }
    ]
  },
  {
    id: 2,
    name: "무력",
    theme: "무기력 · 슬픔 · 탈진 · 체념",
    color: "text-rose-500", 
    bg: "bg-rose-50",
    btnBg: "bg-rose-500",
    steps: [
      {
        title: "나는 언제부터 지쳐 있었는가",
        questions: [
          { question: "요즘 가장 자주 드는 생각은?", options: [{ id: 'A', text: "그냥 다 귀찮다" }, { id: 'B', text: "해도 소용없을 것 같다" }, { id: 'C', text: "쉬고 싶은데 쉴 수 없다" }, { id: 'D', text: "잘 모르겠다" }] },
          { question: "이 느낌은 언제부터 있었던 것 같나요?", options: [{ id: 'A', text: "최근 몇 달" }, { id: 'B', text: "1~2년 전부터" }, { id: 'C', text: "꽤 오래전부터" }, { id: 'D', text: "기억이 잘 안 난다" }] },
          { question: "하루 중 가장 에너지가 떨어지는 시간은?", options: [{ id: 'A', text: "아침부터 이미" }, { id: 'B', text: "오후가 되면" }, { id: 'C', text: "밤이 되면" }, { id: 'D', text: "하루 종일 비슷하다" }] },
          { question: "이 상태에서도 내가 계속 해오던 것은?", options: [{ id: 'A', text: "책임" }, { id: 'B', text: "의무" }, { id: 'C', text: "기대에 맞추기" }, { id: 'D', text: "최소한의 생존" }] },
        ],
        subjectiveQuestion: "‘괜찮은 척’ 하기 시작했던 시점이 떠오른다면 언제인가요?",
        statusSummary: "현재 당신은 깊은 에너지의 소진 속에 머물러 있습니다. 이 단계에서는 생존의 의욕이 낮아져, 당신이라는 존재 자체가 그 고요한 정지 상태와 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "무력감은 단순히 게으름의 상태가 아니라, 오랫동안 과부하된 의식이 스스로를 보호하기 위해 잠시 멈춘 상태에 가깝습니다. 이것은 에너지가 없는 것이 아니라, 에너지를 사용하는 법을 잊은 보호 기제입니다.",
        wisdoms: [
          { sage: "진정으로 쉬는 법을 안다면 당신은 이미 모든 것을 이룬 것이다", source: "노자 | 도덕경" },
          { sage: "거문고 줄은 너무 팽팽해도 소리가 나지 않는다", source: "부처 | 아함경" }
        ],
        common: "멈춤은 실패가 아니라 회복을 위한 필수적인 과정입니다. 너무 팽팽하게 당겨진 마음의 줄을 잠시 늦출 때, 비로소 당신의 삶은 다시 아름다운 소리를 낼 수 있습니다.",
        bridgePhrase: "이제 질문은 “왜 이렇게 되었을까?”가 아니라 이것입니다.",
        transitionPrompt: "나는 왜 쉬지 못했을까",
        nextStepTitle: "나는 왜 멈추지 못했는가",
      },
      {
        title: "나는 왜 멈추지 못했는가",
        questions: [
          { question: "쉬고 싶을 때 가장 먼저 드는 생각은?", options: [{ id: 'A', text: "이 정도도 못 하면 안 된다" }, { id: 'B', text: "나 말고 할 사람이 없다" }, { id: 'C', text: "쉬면 더 뒤처질 것 같다" }, { id: 'D', text: "이유 없이 불안하다" }] },
          { question: "멈추면 생길 것 같은 일은?", options: [{ id: 'A', text: "실망을 줄 것이다" }, { id: 'B', text: "쓸모없어질 것이다" }, { id: 'C', text: "버려질 수 있다" }, { id: 'D', text: "잘 모르겠다" }] },
          { question: "나에게 ‘쉴 자격’이 있다고 느끼나요?", options: [{ id: 'A', text: "거의 없다" }, { id: 'B', text: "조건부로 있다" }, { id: 'C', text: "가끔은 있다" }, { id: 'D', text: "잘 모르겠다" }] },
          { question: "마지막으로 죄책감 없이 쉰 기억은?", options: [{ id: 'A', text: "기억나지 않는다" }, { id: 'B', text: "아주 오래전" }, { id: 'C', text: "비교적 최근" }, { id: 'D', text: "없다" }] },
        ],
        subjectiveQuestion: "“지금 멈추면 안 된다”고 말하는 목소리는 누구의 것 같나요?",
        statusSummary: "현재 당신은 멈추지 못하는 관성 속에 머물러 있습니다. 이 단계에서는 뒤처짐에 대한 공포가 너무 커서, 당신이라는 존재 자체가 그 쉴 틈 없는 움직임과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "멈추지 못하는 관성은 '생존 본능'과 연결되어 있습니다. 멈추면 존재 가치가 사라질 것이라는 착각이 당신을 무한한 소진의 굴레로 밀어넣고 있는 것입니다.",
        wisdoms: [
          { sage: "범사에 기한이 있고 천하 만사가 다 때가 있나니", source: "솔로몬 | 전도서 3:1" },
          { sage: "그대에게 일어나는 일을 막을 수는 없으나 그 일에 대한 그대의 판단은 그대가 다스릴 수 있다", source: "에픽테토스 | 담론록" }
        ],
        common: "모든 것에는 때가 있습니다. 멈춤의 시간은 낭비가 아니라, 다음 도약을 위해 땅을 다지는 거룩한 기회임을 성자들은 강조합니다.",
        bridgePhrase: "이제 한 걸음 더 들어가면 이 질문과 마주하게 됩니다.",
        transitionPrompt: "나는 왜 이렇게까지 나를 소진시켰을까",
        nextStepTitle: "나는 왜 나를 소진시켰는가",
      },
      {
        title: "나는 왜 나를 소진시켰는가",
        questions: [
          { question: "버티고 나면, 잠깐이라도 느껴졌던 것은?", options: [{ id: 'A', text: "안도" }, { id: 'B', text: "인정받았다는 느낌" }, { id: 'C', text: "비교 우위" }, { id: 'D', text: "아무것도 없음" }] },
          { question: "힘들수록 더 하게 되는 행동은?", options: [{ id: 'A', text: "더 참고 버틴다" }, { id: 'B', text: "감정을 끊어낸다" }, { id: 'C', text: "스스로를 몰아붙인다" }, { id: 'D', text: "멍해진다" }] },
          { question: "이 방식은 처음 누구에게서 배웠나요?", options: [{ id: 'A', text: "부모" }, { id: 'B', text: "사회 / 조직" }, { id: 'C', text: "생존을 위해 혼자" }, { id: 'D', text: "기억나지 않는다" }] },
          { question: "이 방식이 없었다면, 그때의 나는?", options: [{ id: 'A', text: "무너졌을 것이다" }, { id: 'B', text: "버려졌을 것이다" }, { id: 'C', text: "살아남기 힘들었을 것이다" }, { id: 'D', text: "잘 모르겠다" }] },
        ],
        subjectiveQuestion: "‘버티는 나’ 말고 다른 선택지가 없던 순간이 떠오르나요?",
        statusSummary: "현재 당신은 스스로를 도구로 대하는 착취적 질서 속에 머물러 있습니다. 이 단계에서는 소진이 곧 미덕이라는 믿음이 너무 깊어, 당신이라는 존재 자체가 그 고단한 버팀과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "자기 소진은 일종의 '정서적 담보'입니다. 고통을 담보로 안전과 인정을 얻으려 했던 무의식적인 거래가 이제 한계에 도달하여, 몸과 마음이 셧다운을 선언한 상태입니다.",
        wisdoms: [
          { sage: "헛되고 헛되며 헛되고 헛되니 모든 것이 헛되도다", source: "솔로몬 | 전도서 1:2" },
          { sage: "지나간 일에 마음을 두지 말고 장래의 일을 걱정하지 말라 오직 현재를 살라", source: "마르쿠스 아우렐리우스 | 명상록" }
        ],
        common: "자신을 소모하여 얻은 모든 것은 결국 헛된 것임을 깨달아야 합니다. 진정한 생명력은 밖으로 소진하는 데 있지 않고, 안으로 현존하는 데 있습니다.",
        bridgePhrase: "여기까지 오면 이 질문을 피하기 어렵습니다.",
        transitionPrompt: "이 무력함은 나를 지키고 있었을까",
        nextStepTitle: "이 무력함은 무엇을 지켜주었는가",
      },
      {
        title: "이 무력함은 무엇을 지켜주었는가",
        questions: [
          { question: "아무것도 하지 않을 때, 피할 수 있었던 것은?", options: [{ id: 'A', text: "실패" }, { id: 'B', text: "평가" }, { id: 'C', text: "기대" }, { id: 'D', text: "상처" }] },
          { question: "무기력할 때, 가장 덜 느껴지는 감정은?", options: [{ id: 'A', text: "분노" }, { id: 'B', text: "욕망" }, { id: 'C', text: "슬픔" }, { id: 'D', text: "기쁨" }] },
          { question: "이 상태는 나를?", options: [{ id: 'A', text: "보호했다" }, { id: 'B', text: "멈추게 했다" }, { id: 'C', text: "고립시켰다" }, { id: 'D', text: "동시에 그랬다" }] },
          { question: "이 무력함이 사라진다면 가장 두려운 것은?", options: [{ id: 'A', text: "다시 상처받는 것" }, { id: 'B', text: "책임을 져야 하는 것" }, { id: 'C', text: "기대하게 되는 것" }, { id: 'D', text: "모르겠다" }] },
        ],
        subjectiveQuestion: "이 무력함이 나를 대신해 막아준 것이 있다면 무엇일까요?",
        statusSummary: "현재 당신은 무력이라는 견고한 방패 속에 머물러 있습니다. 이 단계에서는 상처에 대한 두려움이 너무 압도적이어서, 당신이라는 존재 자체가 그 무감각한 보호막과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "이것은 의식의 '비상 브레이크'입니다. 감당할 수 없는 고통으로부터 자아를 보호하기 위해, 모든 입출력 채널을 차단함으로써 더 이상의 에너지 누수를 막으려는 무의식의 최후 수단입니다.",
        wisdoms: [
          { sage: "마음이 모든 현상의 근본이다 마음에서 모든 것이 나오고 마음으로 모든 것이 이루어진다", source: "부처 | 법구경" },
          { sage: "보라 새 것이 되었도다", source: "사도 바울 | 고린도후서 5:17" }
        ],
        common: "모든 것은 마음의 작용입니다. 무력이라는 방어막을 걷어내는 용기는, 당신이 이미 새로운 존재로 거듭날 준비가 되었음을 믿는 것에서 시작됩니다.",
        bridgePhrase: "이제 마지막 질문이 남습니다.",
        transitionPrompt: "나는 정말 무엇을 원하고 있는가",
        nextStepTitle: "나는 정말 무엇을 원하고 있는가",
      },
      {
        title: "나는 정말 무엇을 원하고 있는가",
        questions: [
          { question: "아무도 기대하지 않는다면, 가장 하고 싶은 것은?", options: [{ id: 'A', text: "쉬기" }, { id: 'B', text: "아무것도 안 하기" }, { id: 'C', text: "나만의 리듬 찾기" }, { id: 'D', text: "모르겠다" }] },
          { question: "‘원한다’는 말에 드는 감정은?", options: [{ id: 'A', text: "부담" }, { id: 'B', text: "허무" }, { id: 'C', text: "미세한 설렘" }, { id: 'D', text: "공백" }] },
          { question: "이 질문 앞에서 느껴지는 것은?", options: [{ id: 'A', text: "두려움" }, { id: 'B', text: "피로" }, { id: 'C', text: "아주 작은 살아있음" }, { id: 'D', text: "말하기 어렵다" }] },
          { question: "지금 당장 바꾸지 않아도 괜찮다는 말에?", options: [{ id: 'A', text: "믿기 어렵다" }, { id: 'B', text: "조금 숨이 트인다" }, { id: 'C', text: "안도감이 든다" }, { id: 'D', text: "아무 느낌 없다" }] },
        ],
        subjectiveQuestion: "아주 작아도 괜찮으니, 지금의 내가 바라는 ‘단 하나’는?",
        statusSummary: "현재 당신은 아주 미세하게 요동치는 욕망의 불씨 속에 머물러 있습니다. 이 단계에서는 생명의 신호가 조심스럽게 피어올라, 당신이라는 존재 자체가 그 작은 설렘과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "에너지의 씨앗을 찾는 과정입니다. 거창한 목표가 아니라, 아주 사소한 욕망(잠을 자고 싶다, 물을 마시고 싶다 등)을 허용함으로써 죽어있던 의지의 흐름을 다시 일깨우는 섬세한 작업입니다.",
        wisdoms: [
          { sage: "구하라 그리하면 너희에게 주실 것이요", source: "예수 | 마태복음 7:7" },
          { sage: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니", source: "이사야 | 이사야 40:31" }
        ],
        common: "진정으로 바라는 마음을 회복할 때 새로운 힘이 샘솟습니다. 당신의 가장 작은 욕구에 정직해지는 것, 그것이 무력을 넘어 생명으로 나아가는 유일한 길입니다.",
        bridgePhrase: "이 신호를 따라간 사람들은 다음 단계에서 이런 감각과 만났습니다.",
        transitionPrompt: "나는 두려워서 움직이지 못하고 있었구나",
        nextStepTitle: "Level 3 · 불안 — 나는 무엇을 두려워하고 있는가",
      }
    ]
  },
  {
    id: 3,
    name: "불안",
    theme: "두려움 · 통제욕구 · 회피",
    color: "text-orange-600",
    bg: "bg-orange-50",
    btnBg: "bg-orange-600",
    steps: [
      {
        title: "나는 무엇을 두려워하고 있는가",
        questions: [
          { question: "요즘 가장 자주 나를 흔드는 불안은?", options: [{ id: 'A', text: "실제로 벌어지고 있는 일" }, { id: 'B', text: "아직 오지 않은 미래" }, { id: 'C', text: "타인의 평가와 시선" }, { id: 'D', text: "막연해서 말로 설명하기 어렵다" }] },
          { question: "이 불안이 올라올 때, 나는 나를 어떻게 바라보고 있나요?", options: [{ id: 'A', text: "부족한 사람" }, { id: 'B', text: "언제든 실패할 수 있는 사람" }, { id: 'C', text: "통제하지 않으면 위험한 존재" }, { id: 'D', text: "잘 모르겠다" }] },
          { question: "이 불안을 느낄 때 가장 먼저 하게 되는 행동은?", options: [{ id: 'A', text: "머릿속으로 계속 대비한다" }, { id: 'B', text: "선택을 미룬다" }, { id: 'C', text: "더 완벽해지려 한다" }, { id: 'D', text: "애써 아무렇지 않은 척한다" }] },
          { question: "만약 이 불안이 잠시 멈춘다면, 가장 먼저 변할 것은?", options: [{ id: 'A', text: "말이 조금 솔직해질 것 같다" }, { id: 'B', text: "선택이 빨라질 것 같다" }, { id: 'C', text: "몸이 가벼워질 것 같다" }, { id: 'D', text: "오히려 공허해질 것 같다" }] },
        ],
        subjectiveQuestion: "이 불안이 막아주고 있는 것은 무엇인가요?",
        statusSummary: "현재 당신은 안개처럼 자욱한 미래의 걱정 속에 머물러 있습니다. 이 단계에서는 보이지 않는 위협이 너무 실재적으로 느껴져, 당신이라는 존재 자체가 그 흔들리는 불안과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "불안은 '문제'가 아니라 에너지가 방향을 잃은 신호입니다. 해결하려고 애쓰기보다, 그저 일어나고 있는 현상으로 관찰하는 것이 필요합니다.",
        wisdoms: [
          { sage: "사랑 안에 두려움이 없고 온전한 사랑이 두려움을 내쫓나니", source: "사도 요한 | 요한1서 4:18" },
          { sage: "두려움은 우리의 생존 본능이 만들어낸 가장 강력한 환상이다", source: "세네카 | 스토아 철학" }
        ],
        common: "두려움은 실체가 없는 그림자와 같습니다. 온전한 수용과 사랑의 빛을 비출 때, 당신을 가두었던 불안의 안개는 서서히 걷히기 시작합니다.",
        bridgePhrase: "불안의 실체를 응시하기 시작했다면, 다음 질문이 당신을 기다립니다.",
        transitionPrompt: "나는 무엇을 통제하려 하는가",
        nextStepTitle: "나는 무엇을 통제하려 하는가",
      },
      {
        title: "나는 무엇을 통제하려 하는가",
        questions: [
          { question: "불안할수록 내가 집착하는 것은?", options: [{ id: 'A', text: "결과" }, { id: 'B', text: "계획" }, { id: 'C', text: "타인의 반응" }, { id: 'D', text: "나 자신의 감정" }] },
          { question: "통제가 무너질 때 가장 견디기 힘든 감정은?", options: [{ id: 'A', text: "무력감" }, { id: 'B', text: "부끄러움" }, { id: 'C', text: "분노" }, { id: 'D', text: "공허함" }] },
          { question: "나는 주로 무엇을 통제하려 하나요?", options: [{ id: 'A', text: "상황" }, { id: 'B', text: "사람" }, { id: 'C', text: "나의 실수" }, { id: 'D', text: "나의 감정" }] },
          { question: "통제가 잘 되고 있다고 느낄 때의 나는?", options: [{ id: 'A', text: "안정적이다" }, { id: 'B', text: "예민하지만 유능하다" }, { id: 'C', text: "긴장돼 있지만 안심된다" }, { id: 'D', text: "감정이 무뎌진다" }] },
        ],
        subjectiveQuestion: "내가 통제하지 않으면 벌어질 것이라 믿는 일은 무엇인가요?",
        statusSummary: "현재 당신은 모든 것을 움켜쥐려는 강박적 통제 속에 머물러 있습니다. 이 단계에서는 삶의 불확실성이 너무 공포스러워, 당신이라는 존재 자체가 그 긴박한 손아귀와 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "불안은 통제 욕구에서 비롯된 반응입니다. 모든 것을 통제할 수 있다는 에고의 오만이 내려놓아질 때 비로소 진정한 평온이 찾아옵니다.",
        wisdoms: [
          { sage: "너희 중에 누가 염려함으로 그 키를 한 자라도 더할 수 있느냐", source: "예수 | 마태복음 6:27" },
          { sage: "통제할 수 없는 일을 통제하려 드는 것이 모든 불행의 근원이다", source: "에픽테토스 | 핸드북" }
        ],
        common: "우리는 삶의 모든 변수를 통제할 수 없습니다. 통제할 수 없는 영역을 신비로 남겨두고, 오직 현재의 마음에 집중할 때 불안의 굴레에서 벗어날 수 있습니다.",
        bridgePhrase: "통제의 헛됨을 보았다면, 이제 그 이면을 마주할 차례입니다.",
        transitionPrompt: "나는 어떤 나를 피하고 있는가",
        nextStepTitle: "나는 어떤 나를 피하고 있는가",
      },
      {
        title: "나는 어떤 나를 피하고 있는가",
        questions: [
          { question: "가장 마주하기 불편한 나의 모습은?", options: [{ id: 'A', text: "부족한 나" }, { id: 'B', text: "의존적인 나" }, { id: 'C', text: "욕심 많은 나" }, { id: 'D', text: "감정적인 나" }] },
          { question: "이 모습을 드러내면 가장 걱정되는 것은?", options: [{ id: 'A', text: "실망을 준다" }, { id: 'B', text: "무시당한다" }, { id: 'C', text: "버려진다" }, { id: 'D', text: "통제력을 잃는다" }] },
          { question: "그래서 나는 보통 어떻게 행동하나요?", options: [{ id: 'A', text: "혼자 해결한다" }, { id: 'B', text: "더 강해진 척한다" }, { id: 'C', text: "감정을 줄인다" }, { id: 'D', text: "관계를 거리 둔다" }] },
          { question: "이 회피가 나에게 주는 이득은?", options: [{ id: 'A', text: "상처를 덜 받는다" }, { id: 'B', text: "유능해 보인다" }, { id: 'C', text: "안정감을 유지한다" }, { id: 'D', text: "갈등을 피한다" }] },
        ],
        subjectiveQuestion: "내가 피하고 있는 이 모습은 무엇으로부터 나를 보호해주고 있나요?",
        statusSummary: "현재 당신은 자신의 결점으로부터 도망치는 회피 속에 머물러 있습니다. 이 단계에서는 부족한 자아를 마주하는 것이 너무 두려워, 당신이라는 존재 자체가 그 필사적인 도망과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "회피의 대상은 상황이 아니라 특정한 '자기 이미지'입니다. 수용하기 힘든 자신의 모습을 부정할 때 불안은 그 틈을 타고 자라납니다.",
        wisdoms: [
          { sage: "일체유심조 모든 것은 마음이 지어내는 것이다", source: "원효 | 화엄경" },
          { sage: "진정으로 자유로운 자는 자기 자신에게서 도망치지 않는 자이다", source: "니체 | 짜라투스트라는 이렇게 말했다" }
        ],
        common: "자신의 그림자를 외면하는 한 불안은 사라지지 않습니다. 자신의 부족함조차 온전한 '나'의 일부로 받아들일 때, 비로소 회피의 에너지는 수용의 힘으로 전환됩니다.",
        bridgePhrase: "회피의 동력을 이해했다면, 이제 에너지의 방향을 살펴봅시다.",
        transitionPrompt: "나는 무엇에 에너지를 쓰고 있는가",
        nextStepTitle: "나는 무엇에 에너지를 쓰고 있는가",
      },
      {
        title: "나는 무엇에 에너지를 쓰고 있는가",
        questions: [
          { question: "요즘 에너지가 가장 많이 소모되는 곳은?", options: [{ id: 'A', text: "생각" }, { id: 'B', text: "감정 관리" }, { id: 'C', text: "관계" }, { id: 'D', text: "미래 대비" }] },
          { question: "이 에너지는 주로 어떤 성격을 띠나요?", options: [{ id: 'A', text: "긴장" }, { id: 'B', text: "방어" }, { id: 'C', text: "대비" }, { id: 'D', text: "억제" }] },
          { question: "에너지가 빠질수록 나타나는 신호는?", options: [{ id: 'A', text: "피로" }, { id: 'B', text: "예민함" }, { id: 'C', text: "무기력" }, { id: 'D', text: "무감각" }] },
          { question: "만약 에너지 사용을 줄인다면 생길 변화는?", options: [{ id: 'A', text: "여유" }, { id: 'B', text: "불안 증가" }, { id: 'C', text: "감정 노출" }, { id: 'D', text: "방향 상실" }] },
        ],
        subjectiveQuestion: "지금의 에너지 사용은 무엇을 유지하기 위한 선택인가요?",
        statusSummary: "현재 당신은 방어와 긴장 속에 머물러 있습니다. 이 단계에서는 대비의 에너지가 너무 치열하여, 당신이라는 존재 자체가 그 경직된 수축과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "에너지는 부족한 것이 아니라 방향이 고정되어 있는 것입니다. 방어와 긴장에 쏟는 에너지를 현재의 존재함으로 돌려놓는 과정이 필요합니다.",
        wisdoms: [
          { sage: "네 마음을 다하고 성품을 다하여 주 너의 하나님을 사랑하라", source: "예수 | 마태복음 22:37" },
          { sage: "에너지는 물과 같아서 가두면 썩고 흐르게 하면 생명이 된다", source: "노자 | 도덕경" }
        ],
        common: "불안을 막기 위해 세운 벽이 오히려 당신의 에너지를 고갈시키고 있습니다. 억지로 막아둔 흐름을 자연스럽게 흐르게 할 때, 에너지는 다시 당신을 회복시키는 힘이 됩니다.",
        bridgePhrase: "에너지의 편중을 알았다면, 이제 새로운 가능성을 열어봅시다.",
        transitionPrompt: "나는 지금 무엇을 허용할 준비가 되었는가",
        nextStepTitle: "나는 지금 무엇을 허용할 준비가 되었는가",
      },
      {
        title: "나는 지금 무엇을 허용할 준비가 되었는가",
        questions: [
          { question: "지금 가장 허용하기 어려운 것은?", options: [{ id: 'A', text: "불완전함" }, { id: 'B', text: "느린 속도" }, { id: 'C', text: "감정의 흔들림" }, { id: 'D', text: "타인의 실망" }] },
          { question: "그중 조금은 열어볼 수 있는 것은?", options: [{ id: 'A', text: "완벽하지 않은 선택" }, { id: 'B', text: "도움 요청" }, { id: 'C', text: "감정 표현" }, { id: 'D', text: "계획 변경" }] },
          { question: "허용이 시작되면 가장 먼저 흔들릴 것은?", options: [{ id: 'A', text: "정체성" }, { id: 'B', text: "관계" }, { id: 'C', text: "안정감" }, { id: 'D', text: "통제감" }] },
          { question: "그럼에도 남아 있을 것 같은 것은?", options: [{ id: 'A', text: "나에 대한 신뢰" }, { id: 'B', text: "회복력" }, { id: 'C', text: "선택의 자유" }, { id: 'D', text: "방향 감각" }] },
        ],
        subjectiveQuestion: "지금의 나는 어디까지는 안전하다고 느끼고 있나요?",
        statusSummary: "현재 당신은 아주 작은 허용의 틈새 속에 머물러 있습니다. 이 단계에서는 통제권을 내려놓는 생소함이 너무 커서, 당신이라는 존재 자체가 그 조심스러운 떨림과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "변화를 강요하기보다 '허용 가능성'의 범위를 자각하는 단계입니다. 아주 작은 틈을 내어주는 것만으로도 빛은 스며들어 불안을 치유하기 시작합니다.",
        wisdoms: [
          { sage: "내 뜻대로 마옵시고 아버지의 원대로 하옵소서", source: "예수 | 마태복음 26:39" },
          { sage: "강한 자는 구부러질 줄 알고 현명한 자는 놓을 줄 안다", source: "장자 | 장자" }
        ],
        common: "삶을 당신의 계획에 맞추려는 고집을 내려놓을 때, 비로소 삶이 당신을 위해 준비한 지혜가 보입니다. 허용은 존재의 거대한 질서에 자신을 정렬하는 용기입니다.",
        bridgePhrase: "허용의 틈으로 들어온 평온을 맛보았다면, 이제 다음 파도를 마주할 준비가 되었습니다.",
        transitionPrompt: "내 안에 분노가 일렁이고 있구나",
        nextStepTitle: "Level 4 · 저항 — 나는 무엇에 저항하고 있는가",
      }
    ]
  },
  {
    id: 4,
    name: "저항",
    theme: "분노 · 자존심 · 내적 구조",
    color: "text-orange-500",
    bg: "bg-orange-50",
    btnBg: "bg-orange-500",
    steps: [
      {
        title: "나는 어떤 역할을 수행하며 살아왔는가",
        questions: [
          { question: "나는 주로 어떤 역할로 인식되어 왔나요?", options: [{ id: 'A', text: "책임지는 사람" }, { id: 'B', text: "버팀목" }, { id: 'C', text: "문제를 해결하는 사람" }, { id: 'D', text: "눈치 빠른 사람" }] },
          { question: "이 역할은 언제부터 굳어졌다고 느끼나요?", options: [{ id: 'A', text: "어린 시절" }, { id: 'B', text: "청소년기" }, { id: 'C', text: "사회에 나오면서" }, { id: 'D', text: "정확히 기억나지 않는다" }] },
          { question: "이 역할을 할 때 가장 억눌린 것은?", options: [{ id: 'A', text: "감정" }, { id: 'B', text: "욕구" }, { id: 'C', text: "약함" }, { id: 'D', text: "선택권" }] },
          { question: "이 역할이 무너질까 봐 가장 두려운 것은?", options: [{ id: 'A', text: "쓸모없어지는 느낌" }, { id: 'B', text: "관계 붕괴" }, { id: 'C', text: "혼란" }, { id: 'D', text: "나 자신을 잃는 느낌" }] },
        ],
        subjectiveQuestion: "이 역할은 누구를 지키기 위해 만들어졌을까요?",
        statusSummary: "현재 당신은 오랫동안 유지해온 특정 역할 속에 머물러 있습니다. 이 단계에서는 그 역할의 무게가 너무 무거워, 당신이라는 존재 자체가 그 가면과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "역할과의 동일시는 에고가 스스로를 보호하는 가장 강력한 수단입니다. 당신이 수행해온 역할이 당신의 본질이 아님을 깨닫는 과정은 일시적인 혼란을 동반할 수 있습니다.",
        wisdoms: [
          { sage: "화 있을진저 외식하는 서기구들과 바리새인들이여", source: "예수 | 마태복음 23:27" },
          { sage: "너는 네 자신이 되어야 한다", source: "니체 | 짜라투스트라는 이렇게 말했다" }
        ],
        common: "타인의 시선과 사회적 필요에 의해 만들어진 가면은 결코 안식을 주지 못합니다. 억눌린 본연의 목소리에 귀를 기울일 때 비로소 진정한 자아를 회복할 수 있습니다.",
        bridgePhrase: "역할 뒤에 숨겨진 신념을 마주할 준비가 되었다면 다음으로 나아갑니다.",
        transitionPrompt: "나는 무엇을 당연한 것으로 여겨왔는가",
        nextStepTitle: "나는 무엇을 ‘당연한 것’으로 여겨왔는가",
      },
      {
        title: "나는 무엇을 ‘당연한 것’으로 여겨왔는가",
        questions: [
          { question: "나는 어떤 생각을 거의 의심하지 않나요?", options: [{ id: 'A', text: "나는 늘 준비돼 있어야 한다" }, { id: 'B', text: "실수하면 안 된다" }, { id: 'C', text: "감정은 통제해야 한다" }, { id: 'D', text: "사람들은 쉽게 떠난다" }] },
          { question: "이 생각이 흔들릴 때 느끼는 감정은?", options: [{ id: 'A', text: "불안" }, { id: 'B', text: "분노" }, { id: 'C', text: "공허" }, { id: 'D', text: "혼란" }] },
          { question: "이 신념은 주로 나를 어디로 몰아갔나요?", options: [{ id: 'A', text: "과도한 책임" }, { id: 'B', text: "자기 검열" }, { id: 'C', text: "거리 두기" }, { id: 'D', text: "끊임없는 대비" }] },
          { question: "이 신념 덕분에 얻은 것은?", options: [{ id: 'A', text: "안정" }, { id: 'B', text: "예측 가능성" }, { id: 'C', text: "통제감" }, { id: 'D', text: "생존" }] },
        ],
        subjectiveQuestion: "이 믿음이 없었다면 과거의 나는 무엇을 감당하기 어려웠을까요?",
        statusSummary: "현재 당신은 의심하지 않았던 견고한 신념 속에 머물러 있습니다. 이 단계에서는 생각의 벽이 너무 단단하여, 당신이라는 존재 자체가 그 고정관념과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "고정된 관념은 의식의 확장을 가로막는 보이지 않는 감옥입니다. 의심하지 않았던 전제를 의심하는 것이 지혜의 시작입니다.",
        wisdoms: [
          { sage: "이 세상의 모든 고통은 자기 자신에 대한 집착에서 비롯된다", source: "부처 | 아함경" },
          { sage: "우리가 두려워하는 것은 사물 그 자체가 아니라 사물에 대한 우리의 생각이다", source: "에픽테토스 | 핸드북" }
        ],
        common: "당신을 보호했던 낡은 신념들이 이제는 당신을 구속하고 있습니다. 그 신념들이 사실이 아닌 하나의 '선택'이었음을 인지할 때 자유의 공간이 열립니다.",
        bridgePhrase: "이제 그 신념들이 감정을 어떻게 억누르고 있는지 살펴봅시다.",
        transitionPrompt: "나는 감정을 어떻게 처리해왔는가",
        nextStepTitle: "나는 감정을 어떻게 처리해왔는가",
      },
      {
        title: "나는 감정을 어떻게 처리해왔는가",
        questions: [
          { question: "감정이 올라올 때 가장 익숙한 반응은?", options: [{ id: 'A', text: "분석한다" }, { id: 'B', text: "참는다" }, { id: 'C', text: "다른 일로 덮는다" }, { id: 'D', text: "거리 둔다" }] },
          { question: "특히 다루기 어려운 감정은?", options: [{ id: 'A', text: "분노" }, { id: 'B', text: "슬픔" }, { id: 'C', text: "의존 욕구" }, { id: 'D', text: "기쁨" }] },
          { question: "이 감정을 허용하지 않았던 이유는?", options: [{ id: 'A', text: "통제 상실이 두려워서" }, { id: 'B', text: "약해 보일까 봐" }, { id: 'C', text: "부담을 주기 싫어서" }, { id: 'D', text: "감당할 수 없을 것 같아서" }] },
          { question: "그 결과 가장 줄어든 것은?", options: [{ id: 'A', text: "생동감" }, { id: 'B', text: "친밀감" }, { id: 'C', text: "자발성" }, { id: 'D', text: "회복력" }] },
        ],
        subjectiveQuestion: "이 감정을 억제함으로써 유지할 수 있었던 질서는 무엇이었나요?",
        statusSummary: "현재 당신은 감정을 다스리는 익숙한 질서 속에 머물러 있습니다. 이 단계에서는 억제의 습관이 너무 치밀하여, 당신이라는 존재 자체가 그 무감각한 평온과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "억눌린 감정은 사라지지 않고 무의식적 저항으로 남습니다. 감정의 파동을 통제하려는 시도가 오히려 내면의 거대한 긴장을 유발합니다.",
        wisdoms: [
          { sage: "노하기를 더디하는 자는 용사보다 낫고 자기의 마음을 다스리는 자는 성을 빼앗는 자보다 나으니라", source: "솔로몬 | 잠언 16:32" },
          { sage: "네 감정의 주인이 되어라, 그렇지 않으면 감정이 네 주인이 될 것이다", source: "호라티우스 | 서간집" }
        ],
        common: "감정은 다스림의 대상이지 억압의 대상이 아닙니다. 일어나는 감정을 판단 없이 관찰할 때, 그것은 비로소 파괴적인 힘에서 정화된 에너지로 변화합니다.",
        bridgePhrase: "내면의 질서가 타인과의 관계에서 어떻게 나타나는지 확인합니다.",
        transitionPrompt: "나는 어떤 방식으로 관계를 맺는가",
        nextStepTitle: "나는 어떤 방식으로 관계를 맺는가",
      },
      {
        title: "나는 어떤 방식으로 관계를 맺는가",
        questions: [
          { question: "관계에서 내가 주로 취하는 위치는?", options: [{ id: 'A', text: "책임자" }, { id: 'B', text: "조율자" }, { id: 'C', text: "관찰자" }, { id: 'D', text: "거리 유지자" }] },
          { question: "관계가 깊어질수록 불편해지는 것은?", options: [{ id: 'A', text: "기대" }, { id: 'B', text: "의존" }, { id: 'C', text: "감정 노출" }, { id: 'D', text: "갈등 가능성" }] },
          { question: "그래서 나는 주로 어떻게 조절하나요?", options: [{ id: 'A', text: "선택적으로 선을 긋는다" }, { id: 'B', text: "역할에만 집중한다" }, { id: 'C', text: "감정 공유를 피한다" }, { id: 'D', text: "혼자 감당하려 한다" }] },
          { question: "이 방식의 가장 큰 장점은?", options: [{ id: 'A', text: "안전" }, { id: 'B', text: "예측 가능성" }, { id: 'C', text: "통제" }, { id: 'D', text: "독립성" }] },
        ],
        subjectiveQuestion: "이 관계 방식은 어떤 상처를 반복하지 않기 위한 선택이었을까요?",
        statusSummary: "현재 당신은 타인과의 안전한 거리감 속에 머물러 있습니다. 이 단계에서는 경계의 심리가 너무 예민하여, 당신이라는 존재 자체가 그 높은 성벽과 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "관계 패턴은 유아기부터 형성된 생존 지도와 같습니다. 이 지도가 현재의 풍요로운 관계를 방해하고 있지는 않은지 검토해야 합니다.",
        wisdoms: [
          { sage: "새 계명을 너희에게 주노니 서로 사랑하라", source: "예수 | 요한복음 13:34" },
          { sage: "군자는 화이부동하고 소인은 동이불화한다", source: "공자 | 논어" }
        ],
        common: "진정한 연결은 완벽한 통제가 아닌 취약함의 공유에서 시작됩니다. 상처받을 용기를 낼 때, 타인은 위협이 아닌 함께 걷는 도반이 됩니다.",
        bridgePhrase: "이제 당신이 허용할 수 있는 변화의 경계를 확인합니다.",
        transitionPrompt: "나는 어떤 변화까지는 감당할 수 있는가",
        nextStepTitle: "나는 어떤 변화까지는 감당할 수 있는가",
      },
      {
        title: "나는 어떤 변화까지는 감당할 수 있는가",
        questions: [
          { question: "지금 가장 감당하기 어려운 변화는?", options: [{ id: 'A', text: "관계 방식 변화" }, { id: 'B', text: "정체성 흔들림" }, { id: 'C', text: "감정 증가" }, { id: 'D', text: "통제 감소" }] },
          { question: "그중 아주 미세하게 열 수 있는 것은?", options: [{ id: 'A', text: "완벽 기준 완화" }, { id: 'B', text: "감정 인식" }, { id: 'C', text: "도움 요청" }, { id: 'D', text: "선택 유예" }] },
          { question: "변화가 시작되면 가장 먼저 불안해질 것은?", options: [{ id: 'A', text: "안정감" }, { id: 'B', text: "효율" }, { id: 'C', text: "인정" }, { id: 'D', text: "질서" }] },
          { question: "그럼에도 유지될 가능성이 높은 것은?", options: [{ id: 'A', text: "판단력" }, { id: 'B', text: "회복력" }, { id: 'C', text: "자기 인식" }, { id: 'D', text: "선택 능력" }] },
        ],
        subjectiveQuestion: "지금의 나는 어떤 변화까지는 안전하다고 느끼나요?",
        statusSummary: "현재 당신은 변화에 대한 저항 속에 머물러 있습니다. 이 단계에서는 정체성을 잃는 것에 대한 두려움이 깊어, 당신이라는 존재 자체가 그 익숙한 구조와 하나가 된 것처럼 느껴지는 상태입니다.",
        mechanism: "저항은 변화가 아니라 상실에 대한 두려움입니다. 잃어버릴 것이라고 생각했던 것들이 사실은 짐이었음을 깨닫는 순간, 저항은 추진력으로 바뀝니다.",
        wisdoms: [
          { sage: "보라 내가 만물을 새롭게 하노라", source: "예수 | 요한계시록 21:5" },
          { sage: "만물은 흐른다, 아무것도 머무르지 않는다", source: "헤라클레이토스 | 단편" }
        ],
        common: "변화는 존재의 본질입니다. 저항을 멈추고 흐름에 몸을 맡길 때, 당신은 비로소 고정된 구조물에서 살아있는 생명체로 회복됩니다.",
        bridgePhrase: "내면의 구조를 해체한 당신은 이제 새로운 선택을 할 수 있습니다.",
        transitionPrompt: "나는 이제 무엇을 선택하겠는가",
        nextStepTitle: "Level 5 · 용기 — 나는 현실을 직면할 준비가 되었는가",
      }
    ]
  }
];

export const InsightView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [viewState, setViewState] = useState<'selection' | 'quiz' | 'result'>('selection');
  const [levelIdx, setLevelIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [subjectiveInput, setSubjectiveInput] = useState('');

  const currentLevel = INSIGHT_DATA[levelIdx] || INSIGHT_DATA[0];
  const currentStep = currentLevel?.steps[stepIdx];
  const totalQuestions = currentStep?.questions.length || 0;
  const isSubjective = questionIdx === totalQuestions;
  const currentQuestion = !isSubjective ? currentStep?.questions[questionIdx] : null;

  const progress = ((questionIdx + 1) / (totalQuestions + 1)) * 100;

  const handleLevelSelect = (idx: number) => {
    setLevelIdx(idx);
    setStepIdx(0);
    setQuestionIdx(0);
    setAnswers([]);
    setViewState('quiz');
  };

  const handleAnswerSelect = (option: Option) => {
    setAnswers(prev => [...prev, option]);
    setQuestionIdx(prev => prev + 1);
  };

  const handleSubjectiveSubmit = () => {
    setViewState('result');
  };

  const goToNextStep = () => {
    if (stepIdx < currentLevel.steps.length - 1) {
      setStepIdx(prev => prev + 1);
      setQuestionIdx(0);
      setAnswers([]);
      setSubjectiveInput('');
      setViewState('quiz');
    } else if (levelIdx < INSIGHT_DATA.length - 1) {
      setLevelIdx(prev => prev + 1);
      setStepIdx(0);
      setQuestionIdx(0);
      setAnswers([]);
      setSubjectiveInput('');
      setViewState('quiz');
    } else {
      onBack();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E9EEF6] relative overflow-hidden animate-in">
      <header className="flex-none px-8 pt-10 pb-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="text-meta text-slate-400">의식 성찰 리포트</span>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col z-10">
        {viewState === 'selection' && (
          <div className="space-y-10 animate-in pb-20 p-8">
            <div className="space-y-3">
              <h2 className="serif text-2xl font-bold text-slate-900 leading-tight">객관적 성찰을 위한 <br/>의식의 층위 선택.</h2>
              <p className="text-sm text-slate-400 font-medium italic">현상을 관찰할 준비가 되었다면 시작하십시오.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {INSIGHT_DATA.map((level, idx) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(idx)}
                  className="w-full p-6 text-left rounded-[2.5rem] bg-white border border-slate-100 shadow-premium transition-all group flex items-center justify-between hover:border-growth-blue/20"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${level.bg} flex items-center justify-center font-black ${level.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      {level.id}
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold serif ${level.color}`}>{level.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{level.theme}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-growth-blue" />
                </button>
              ))}
            </div>
          </div>
        )}

        {viewState === 'quiz' && currentStep && (
          <div className="flex-1 flex flex-col animate-in">
            <div className="w-full h-1 bg-slate-200 overflow-hidden">
               <div className={`h-full ${currentLevel.btnBg} transition-all duration-700 ease-out`} style={{ width: `${progress}%` }} />
            </div>
            <div className="p-8 space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className={`inline-block px-4 py-1.5 rounded-full ${currentLevel.bg} ${currentLevel.color} text-[10px] font-bold uppercase tracking-widest`}>
                    Step {stepIdx + 1}: {currentStep.title}
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {questionIdx + 1} / {totalQuestions + 1}
                  </div>
                </div>
                <h2 className="serif text-2xl font-bold text-slate-900 leading-snug">
                  {isSubjective ? currentStep.subjectiveQuestion : currentQuestion?.question}
                </h2>
              </div>
              
              {!isSubjective ? (
                <div className="space-y-4">
                  {currentQuestion?.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerSelect(opt)}
                      className="w-full p-6 text-left rounded-3xl bg-white border border-slate-100 hover:border-growth-blue/30 hover:bg-blue-50/10 transition-all active:scale-[0.98] shadow-sm flex items-center gap-4 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-300 group-hover:bg-growth-blue group-hover:text-white transition-colors">{opt.id}</div>
                      <span className="text-[15px] font-bold text-slate-700">{opt.text}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <PenLine size={18} className="absolute left-6 top-6 text-slate-300" />
                    <textarea
                      value={subjectiveInput}
                      onChange={(e) => setSubjectiveInput(e.target.value)}
                      placeholder="내면의 소리를 기록해보세요."
                      className="w-full h-40 p-6 pt-16 rounded-[2rem] bg-white border border-slate-100 shadow-inner-soft text-[15px] focus:outline-none focus:ring-2 focus:ring-growth-blue/10 transition-all resize-none font-sans"
                    />
                  </div>
                  <button
                    onClick={handleSubjectiveSubmit}
                    disabled={!subjectiveInput.trim()}
                    className="w-full h-16 rounded-full bg-slate-900 text-white font-bold shadow-premium active:scale-95 disabled:bg-slate-200"
                  >
                    리포트 생성하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {viewState === 'result' && currentStep && (
          <div className="flex-1 flex flex-col p-6 space-y-6 animate-in pb-32">
            
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100/50 p-8 space-y-6 relative overflow-hidden">
               <div className={`absolute top-0 left-0 right-0 h-1.5 ${currentLevel.btnBg}`} />
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-xl ${currentLevel.bg} flex items-center justify-center ${currentLevel.color}`}>
                   <ClipboardList size={16} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">현재 상태 요약</span>
               </div>
               <p className="text-[16px] text-slate-900 font-bold serif leading-relaxed">
                 {currentStep.statusSummary}
               </p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100/50 p-8 space-y-6">
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-xl ${currentLevel.bg} flex items-center justify-center ${currentLevel.color}`}>
                   <Zap size={16} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">의식 메커니즘</span>
               </div>
               <p className="text-[15px] text-slate-600 font-medium serif leading-relaxed">
                 {currentStep.mechanism}
               </p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100/50 p-8 space-y-8 overflow-hidden">
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-xl ${currentLevel.bg} flex items-center justify-center ${currentLevel.color}`}>
                   <Library size={16} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">성인의 통찰</span>
               </div>
               
               <div className="flex flex-col gap-6">
                 {currentStep.wisdoms.map((w, i) => (
                   <div key={i} className="p-8 rounded-[2.2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between group hover:bg-white transition-all shadow-inner-soft">
                      <Quote size={20} className="text-slate-200 mb-4 group-hover:text-growth-blue transition-colors" />
                      <p className="text-[15px] text-slate-700 font-bold serif leading-relaxed italic mb-4">
                        "{w.sage}"
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{w.source}</span>
                      </div>
                   </div>
                 ))}
               </div>
               
               <div className="pt-8 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-growth-blue" />
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">공통된 통찰</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <p className="text-[14px] text-slate-700 font-bold serif leading-relaxed">
                      {currentStep.common}
                    </p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 space-y-8 shadow-2xl flex flex-col items-start text-left">
               <div className="space-y-6 w-full">
                  <div className="flex flex-col items-start gap-3 opacity-40">
                    <Sparkles size={16} className="text-white" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">다음 단계로의 도약</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[13px] text-white/50 font-medium serif leading-relaxed">
                      {currentStep.bridgePhrase}
                    </p>
                    <p className="text-[17px] text-white font-bold serif leading-snug italic">
                      “{currentStep.transitionPrompt}”
                    </p>
                  </div>
               </div>
               
               <button
                  onClick={goToNextStep}
                  className={`w-full h-16 rounded-full text-white font-bold flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all group ${currentLevel.btnBg}`}
                >
                  <span className="text-[14px] tracking-tight">
                    {currentStep.nextStepTitle}
                  </span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
