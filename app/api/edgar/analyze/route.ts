import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fileId, userMessage, analysis } = await request.json();

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Mock AI analysis response
    // TODO: Integrate with actual AI service (OpenAI, Claude, etc.)
    const generateAnalysis = (userMessage: string, analysis: any) => {
      const { frequencyBalance, dynamics, stereo } = analysis;
      
      let response = `I've analyzed your track and here are my detailed findings:\n\n`;

      // Frequency analysis
      response += `**Frequency Balance Analysis:**\n`;
      if (frequencyBalance.low < 45) {
        response += `- The low end (bass) is a bit thin. Consider boosting around 60-80Hz for more foundation.\n`;
      } else if (frequencyBalance.low > 55) {
        response += `- The low end is quite heavy. You might want to cut some mud around 200-300Hz.\n`;
      } else {
        response += `- The low end balance looks good.\n`;
      }

      if (frequencyBalance.mid < 45) {
        response += `- The midrange could use more presence. Try boosting 1-3kHz for vocal clarity.\n`;
      } else if (frequencyBalance.mid > 55) {
        response += `- The midrange is a bit harsh. Consider cutting around 2-4kHz.\n`;
      } else {
        response += `- The midrange balance is solid.\n`;
      }

      if (frequencyBalance.high < 45) {
        response += `- The high frequencies need more air. Try a gentle high-shelf boost above 8kHz.\n`;
      } else if (frequencyBalance.high > 55) {
        response += `- The high end is quite bright. Consider rolling off some harsh frequencies above 10kHz.\n`;
      } else {
        response += `- The high frequency balance is well-controlled.\n`;
      }

      // Dynamics analysis
      response += `\n**Dynamics Analysis:**\n`;
      if (dynamics.peak > 0) {
        response += `- Warning: Your track is clipping at ${dynamics.peak}dB. Reduce the master gain.\n`;
      } else {
        response += `- Good headroom with peak at ${dynamics.peak}dB.\n`;
      }

      if (dynamics.rms < -6) {
        response += `- The overall level is quite low. Consider gentle compression to bring up the RMS.\n`;
      } else if (dynamics.rms > 0) {
        response += `- The track is quite loud. Make sure it's not over-compressed.\n`;
      } else {
        response += `- The RMS level is well-balanced.\n`;
      }

      if (dynamics.dynamicRange < 10) {
        response += `- The dynamic range is quite compressed (${dynamics.dynamicRange}dB). Consider less aggressive compression.\n`;
      } else if (dynamics.dynamicRange > 20) {
        response += `- The dynamic range is quite wide (${dynamics.dynamicRange}dB). You might want more compression for consistency.\n`;
      } else {
        response += `- The dynamic range is healthy at ${dynamics.dynamicRange}dB.\n`;
      }

      // Stereo analysis
      response += `\n**Stereo Image Analysis:**\n`;
      if (stereo.width < 70) {
        response += `- The stereo image is quite narrow (${stereo.width}%). Consider widening with stereo imaging tools.\n`;
      } else if (stereo.width > 90) {
        response += `- The stereo image is very wide (${stereo.width}%). Make sure mono compatibility is good.\n`;
      } else {
        response += `- The stereo width looks good at ${stereo.width}%.\n`;
      }

      if (Math.abs(stereo.phase) > 5) {
        response += `- There are some phase issues (${stereo.phase}°). Check for mono compatibility.\n`;
      } else {
        response += `- Phase relationship looks good.\n`;
      }

      // Mastering suggestions
      response += `\n**Mastering Suggestions:**\n`;
      response += `- Consider a gentle high-pass filter around 20-30Hz to remove subsonic content\n`;
      response += `- Add subtle compression on the master bus (2-4dB gain reduction)\n`;
      response += `- Use a limiter to catch any remaining peaks\n`;
      response += `- Consider a gentle high-shelf boost above 10kHz for air\n`;

      // Response to user's specific question
      if (userMessage) {
        response += `\n**Regarding your question:** "${userMessage}"\n`;
        if (userMessage.toLowerCase().includes('mix')) {
          response += `For mixing improvements, focus on the frequency balance issues I mentioned above. The key is getting each element to sit well in the frequency spectrum.\n`;
        } else if (userMessage.toLowerCase().includes('master')) {
          response += `For mastering, the dynamics and stereo image are most important. Make sure you have good headroom and consistent levels.\n`;
        } else if (userMessage.toLowerCase().includes('balance')) {
          response += `The frequency balance analysis above should help you identify which areas need attention.\n`;
        }
      }

      response += `\nWould you like me to elaborate on any of these points or help with specific adjustments?`;

      return response;
    };

    const aiResponse = generateAnalysis(userMessage, analysis);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      fileId
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze audio' },
      { status: 500 }
    );
  }
}
