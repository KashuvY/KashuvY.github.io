---
layout: page
title: Learning Log
permalink: /learning-log/
nav: false
nav_order: 6 # Adjust this number to position it in your navigation
published: false
---

<div class="learning-calendar-wrapper">
  <h2>My Daily Learning Journey</h2>
  <p class="text-muted">
    A visual log of my daily learning activities, inspired by GitHub's contribution graph.
    Each square represents a day. Color intensity indicates activity.
  </p>

  <div id="learning-calendar-grid-container">
    {% assign current_year = "now" | date: "%Y" | plus: 0 %}

    {% assign data_years = site.data.learnings | map: "year" | uniq %}
    {% if data_years == nil or data_years.size == 0 %}
        {% assign data_years = "" | split: "" %} {# Ensure it's an array if no data years #}
    {% endif %}
    {% assign years_to_display = "" | split: "" %}
    {% for y_data in data_years %}
      {% assign years_to_display = years_to_display | push: y_data %}
    {% endfor %}
    {% unless years_to_display contains current_year %}
      {% assign years_to_display = years_to_display | push: current_year %}
    {% endunless %}
    {% assign years_to_display = years_to_display | uniq | sort | reverse %}

    {% if years_to_display.size == 0 %}
      <p>No learning data found. Add entries to <code>_data/learnings.yml</code> with a <code>date: "YYYY-MM-DD"</code> and a <code>year</code> field.</p>
    {% else %}
      {% for year_to_display_num in years_to_display %}
        {% assign year_to_display = year_to_display_num | times: 1 %} {% comment %} Ensure it's a number {% endcomment %}
        <div class="daily-calendar-year-section">
          <h4>{{ year_to_display }}</h4>
          <div class="daily-calendar-graph">
            <div class="month-labels-track">
              {% assign months_short = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec" | split: "," %}
              {% for m_idx in (0..11) %}
                {% comment %} Simplified month positioning - adjust 'times: 4.4' and 'span 4' for better visual alignment based on 53 columns {% endcomment %}
                {% assign col_start = m_idx | times: 4.4 | floor | plus: 1 %}
                <span class="month-label" style="grid-column: {{ col_start }} / span 4;">{{ months_short[m_idx] }}</span>
              {% endfor %}
            </div>
            <div class="day-labels-track">
              <span class="day-label day-label-sun">Sun</span>
              <span class="day-label day-label-mon">Mon</span>
              <span class="day-label day-label-tue">Tue</span>
              <span class="day-label day-label-wed">Wed</span>
              <span class="day-label day-label-thu">Thu</span>
              <span class="day-label day-label-fri">Fri</span>
              <span class="day-label day-label-sat">Sat</span>
            </div>
            <div class="day-cells-grid">
              {% assign year_start_date_str = year_to_display | append: "-01-01" %}
              {% assign first_day_weekday = year_start_date_str | date: "%w" %} {% comment %} 0=Sunday, 1=Monday, ..., 6=Saturday {% endcomment %}
              {% assign offset_cells = first_day_weekday | times: 1 %}

              {% for i in (1..offset_cells) %}
                <div class="day-cell empty-offset"></div>
              {% endfor %}

              {% comment %} Corrected Leap Year Logic Starts Here {% endcomment %}
              {% assign year_val = year_to_display | times: 1 %}
              {% assign mod4 = year_val | modulo: 4 %}
              {% assign mod100 = year_val | modulo: 100 %}
              {% assign mod400 = year_val | modulo: 400 %}

              {% assign is_leap = false %}
              {% if mod400 == 0 %}
                {% assign is_leap = true %}
              {% elsif mod4 == 0 and mod100 != 0 %}
                {% assign is_leap = true %}
              {% endif %}
              {% comment %} Corrected Leap Year Logic Ends Here {% endcomment %}

              {% assign month_day_counts_str = "31,28,31,30,31,30,31,31,30,31,30,31" %}
              {% if is_leap %}
                {% assign month_day_counts_str = "31,29,31,30,31,30,31,31,30,31,30,31" %}
              {% endif %}
              {% assign month_day_counts = month_day_counts_str | split: "," %}

              {% assign total_days_rendered_this_year = 0 %}
              {% for month_index_0based in (0..11) %}
                {% assign month_num = month_index_0based | plus: 1 %}
                {% assign month_str = month_num | prepend: "0" | slice: -2, 2 %}
                {% assign days_in_current_month = month_day_counts[month_index_0based] | times: 1 %}

                {% for day_num in (1..days_in_current_month) %}
                  {% assign day_str = day_num | prepend: "0" | slice: -2, 2 %}
                  {% assign current_date_iso = year_to_display | append: "-" | append: month_str | append: "-" | append: day_str %}
                  {% assign learning_entry = nil %}
                  {% for item in site.data.learnings %}
                    {% if item.date == current_date_iso %}
                      {% assign learning_entry = item %}
                      {% break %}
                    {% endif %}
                  {% endfor %}

                  <div class="day-cell
                    {% if learning_entry %}
                      has-learning intensity-{{ learning_entry.intensity | default: 1 }}
                    {% else %}
                      no-learning
                    {% endif %}"
                    data-date="{{ current_date_iso }}"
                    title="{{ current_date_iso }}{% if learning_entry %} - Intensity: {{ learning_entry.intensity }}{% if learning_entry.activities and learning_entry.activities.size > 0 %} ({{ learning_entry.activities[0].title | truncatewords: 3, "..." }}){% endif %}{% else %} - No activity{% endif %}">
                    {% comment %} {{ day_num }} {% endcomment %}
                  </div>
                  {% assign total_days_rendered_this_year = total_days_rendered_this_year | plus: 1 %}
                {% endfor %}
              {% endfor %}

              {% assign total_grid_cells_target = 53 | times: 7 %}
              {% assign rendered_cells_with_offset = offset_cells | plus: total_days_rendered_this_year %}
              {% if rendered_cells_with_offset < total_grid_cells_target %}
                {% assign remaining_cells_to_fill = total_grid_cells_target | minus: rendered_cells_with_offset %}
                {% for i in (1..remaining_cells_to_fill) %}
                  <div class="day-cell empty-trailing"></div>
                {% endfor %}
              {% endif %}

            </div> </div> </div> {% endfor %}
    {% endif %}
  </div> <div id="learning-details-display" class="learning-details" style="display: none;">
    <h3 id="learning-day-header"></h3>
    <div id="learning-day-activities">
    </div>
  </div>
</div>

<script id="learningsData" type="application/json" style="display: none;">
  {{ site.data.learnings | jsonify }}
</script>

<script src="{{ '/assets/js/learning_calendar.js' | relative_url }}" defer></script>